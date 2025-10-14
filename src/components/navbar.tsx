import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Tooltip } from "@heroui/tooltip";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, UserIcon } from "@/components/icons";
import { LoginModal } from "@/components/login-modal";
import {
  isAuthenticated,
  logout,
  migrateOldAuth,
  validateToken,
} from "@/lib/auth";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      migrateOldAuth();

      if (!isAuthenticated()) {
        setIsAdmin(false);
        return;
      }

      const isValidToken = await validateToken();
      setIsAdmin(isValidToken);
    };

    checkAuth();
  }, []);

  // check backend health so the frontend can disable login when backend is down
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const checkBackend = async () => {
      // Skip network check in test environments to avoid undici/JSDOM URL issues and set Backend available to true to be able to test login modal
      if (
        typeof process !== "undefined" &&
        (process.env.NODE_ENV === "test" || process.env.VITEST)
      ) {
        setBackendAvailable(true);
        return;
      }

      try {
        const res = await fetch("/api/validate", { signal: controller.signal });
        if (!mounted) return;
        setBackendAvailable(res.ok);
      } catch (e) {
        console.error("Error checking backend health:", e);
        if (!mounted) return;
        setBackendAvailable(false);
      }
    };

    checkBackend();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleLoginClick = () => {
    // if backend isn't available, prevent login attempts
    if (!backendAvailable) return;
    if (isAdmin) {
      logout();
      setIsAdmin(false);
      if (window.location.pathname === "/edit") {
        navigate("/");
      } else {
        window.location.reload();
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setIsModalOpen(false);
    navigate("/edit");
  };

  return (
    <>
      <HeroUINavbar maxWidth="xl" position="sticky">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-3"
            color="foreground"
            href="https://github.com/phillipc0/WA-DP"
            target="_blank"
          >
            <Logo />
            <p className="font-bold text-inherit">WA-DP</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          {siteConfig.navItems.map((item) => {
            if (item.href === "/edit" && !isAdmin) {
              return null;
            }

            // hide Home link for non-authenticated users
            if (item.href === "/" && !isAdmin) {
              return null;
            }

            return (
              <NavbarItem
                key={item.href}
                className="hidden sm:flex gap-4 justify-start ml-2"
              >
                <Link
                  className={clsx(
                    linkStyles({
                      color: "foreground",
                    }),
                    "font-bold",
                    location.pathname === item.href &&
                      "border-b-2 border-primary",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden sm:flex">
            <Tooltip
              color="danger"
              content={
                <div className="px-1 py-2 text-center">
                  <div className="text-small font-bold">Backend offline!</div>
                  <div className="text-tiny">
                    You are seeing the standalone frontend, to make
                  </div>
                  <div className="text-tiny">
                    changes you need to start the backend and login.
                  </div>
                </div>
              }
              isDisabled={backendAvailable}
              placement="bottom"
            >
              <span className="inline-block">
                <Button
                  className={
                    !backendAvailable ? "cursor-not-allowed" : undefined
                  }
                  color={isAdmin ? "danger" : "primary"}
                  data-testid={isAdmin ? "logout-button" : "login-button"}
                  disabled={!backendAvailable}
                  endContent={<UserIcon />}
                  variant={!backendAvailable ? "bordered" : "solid"}
                  onPress={handleLoginClick}
                >
                  {isAdmin ? "Logout" : "Login"}
                </Button>
              </span>
            </Tooltip>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item, index) => {
              if (item.href === "/edit" && !isAdmin) {
                // don't show "Edit" unless admin
                return null;
              }
              // hide Home link in mobile menu for non-authenticated users
              if (item.href === "/" && !isAdmin) {
                return null;
              }
              if (item.href === "/logout") {
                // render Login/Logout button in menu
                return (
                  <NavbarMenuItem key={`${item.label}-${index}`}>
                    <Tooltip
                      color="danger"
                      content="Backend is offline. Login/Logout is disabled."
                      isDisabled={backendAvailable}
                      placement="bottom"
                    >
                      <span className="block w-full">
                        <Button
                          className={"w-full justify-start"}
                          color={isAdmin ? "danger" : "primary"}
                          disabled={!backendAvailable}
                          endContent={<UserIcon />}
                          size="lg"
                          variant={!backendAvailable ? "bordered" : "solid"}
                          onPress={handleLoginClick}
                        >
                          {isAdmin ? "Logout" : "Login"}
                        </Button>
                      </span>
                    </Tooltip>
                  </NavbarMenuItem>
                );
              }
              const isActive = location.pathname === item.href;
              return (
                <NavbarMenuItem key={item.href}>
                  <Link
                    className={clsx(
                      "font-bold",
                      isActive && "border-b-2 border-primary",
                    )}
                    color="foreground"
                    href={item.href || "#"}
                    size="lg"
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              );
            })}
          </div>
        </NavbarMenu>
      </HeroUINavbar>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

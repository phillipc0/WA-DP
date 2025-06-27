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
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
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

  const handleLoginClick = () => {
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
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
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
          <div className="hidden sm:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => {
              if (item.href === "/edit" && !isAdmin) {
                return null;
              }

              return (
                <NavbarItem key={item.href}>
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
          </div>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden sm:flex">
            <Button
              color={isAdmin ? "danger" : "primary"}
              data-testid={isAdmin ? "logout-button" : "login-button"}
              onPress={handleLoginClick}
            >
              {isAdmin ? "Logout" : "Login"}
            </Button>
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
              if (item.href === "/logout") {
                // render Login/Logout button in menu
                return (
                  <NavbarMenuItem key={`${item.label}-${index}`}>
                    <Button
                      className="w-full justify-start"
                      color={isAdmin ? "danger" : "primary"}
                      size="lg"
                      variant="light"
                      onPress={handleLoginClick}
                    >
                      {isAdmin ? "Logout" : "Login"}
                    </Button>
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

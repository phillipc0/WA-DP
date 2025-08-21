import { Card, CardBody, CardHeader } from "@heroui/card";

/**
 * Basic skeleton component for loading states
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.width - Width of the skeleton
 * @param props.height - Height of the skeleton
 * @returns Skeleton loading element
 */
export function Skeleton({
  className = "",
  width = "100%",
  height = "20px",
}: {
  className?: string;
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-r from-default-200 via-default-100 to-default-200 animate-pulse rounded-md ${className}`}
      style={{ width, height }}
    />
  );
}

/**
 * Skeleton loader for personal info component
 * @returns Personal info skeleton component
 */
export function PersonalInfoSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
        <div className="flex gap-3">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton height="28px" width="200px" />
            <Skeleton height="20px" width="150px" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="rounded-full" height="24px" width="80px" />
              <Skeleton className="rounded-full" height="24px" width="120px" />
            </div>
          </div>
        </div>
      </CardHeader>
      <div className="px-6 pb-6">
        <Skeleton className="mb-2" height="16px" width="100%" />
        <Skeleton className="mb-4" height="16px" width="80%" />
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height="20px" width="60px" />
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Skeleton loader for skills component
 * @returns Skills skeleton component
 */
export function SkillsSkeleton() {
  return (
    <Card className="w-full border border-default-200/50 shadow-sm">
      <CardHeader className="flex gap-3 items-center bg-gradient-to-r from-default-50 to-default-100/50 border-b border-default-200/50">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton height="24px" width="100px" />
      </CardHeader>
      <CardBody className="p-4">
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border border-default-200/50">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton height="20px" width="120px" />
                  </div>
                  <Skeleton
                    className="rounded-full"
                    height="20px"
                    width="40px"
                  />
                </div>
                <Skeleton className="rounded-full" height="8px" width="100%" />
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * Skeleton loader for CV component
 * @returns CV skeleton component
 */
export function CVSkeleton() {
  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Work Experience Section */}
        <div className="mb-12">
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-divider mb-8">
            <div className="py-4">
              <Skeleton className="mx-auto" height="32px" width="200px" />
            </div>
          </div>

          {/* Experience Items */}
          {[1, 2].map((i) => (
            <div key={i} className="relative w-full mb-8">
              {/* Desktop Layout */}
              <div className="hidden md:block w-full">
                <div className="relative flex items-start">
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10 top-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>

                  {i % 2 === 1 ? (
                    <>
                      <div className="w-1/2 pr-8">
                        <Card className="shadow-lg">
                          <CardBody className="p-6">
                            <div className="space-y-3">
                              <Skeleton height="20px" width="180px" />
                              <Skeleton height="16px" width="150px" />
                              <Skeleton height="14px" width="100px" />
                              <Skeleton height="14px" width="100%" />
                              <Skeleton height="14px" width="80%" />
                              <div className="flex gap-1 mt-3">
                                <Skeleton
                                  className="rounded-full"
                                  height="20px"
                                  width="60px"
                                />
                                <Skeleton
                                  className="rounded-full"
                                  height="20px"
                                  width="80px"
                                />
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                      <div className="w-1/2 pl-8 flex justify-start items-start pt-4">
                        <Skeleton
                          className="rounded-md"
                          height="28px"
                          width="100px"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-1/2 pr-8 flex justify-end items-start pt-4">
                        <Skeleton
                          className="rounded-md"
                          height="28px"
                          width="100px"
                        />
                      </div>
                      <div className="w-1/2 pl-8">
                        <Card className="shadow-lg">
                          <CardBody className="p-6">
                            <div className="space-y-3">
                              <Skeleton height="20px" width="180px" />
                              <Skeleton height="16px" width="150px" />
                              <Skeleton height="14px" width="100px" />
                              <Skeleton height="14px" width="100%" />
                              <Skeleton height="14px" width="80%" />
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="flex md:hidden items-start w-full">
                <div className="relative z-10 mr-6">
                  <Skeleton className="w-12 h-12 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton
                    className="mb-3 rounded-md"
                    height="20px"
                    width="100px"
                  />
                  <Card className="shadow-lg">
                    <CardBody className="p-4">
                      <div className="space-y-3">
                        <Skeleton height="18px" width="160px" />
                        <Skeleton height="16px" width="120px" />
                        <Skeleton height="14px" width="80px" />
                        <Skeleton height="14px" width="100%" />
                        <Skeleton height="14px" width="70%" />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="mb-12">
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-divider mb-8">
            <div className="py-4">
              <Skeleton className="mx-auto" height="32px" width="150px" />
            </div>
          </div>

          <div className="relative w-full mb-8">
            <div className="hidden md:block w-full">
              <div className="relative flex items-start">
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 top-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                </div>
                <div className="w-1/2 pr-8">
                  <Card className="shadow-lg">
                    <CardBody className="p-6">
                      <div className="space-y-3">
                        <Skeleton height="20px" width="200px" />
                        <Skeleton height="16px" width="180px" />
                        <Skeleton height="14px" width="100px" />
                        <Skeleton height="14px" width="100%" />
                        <Skeleton height="14px" width="90%" />
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="w-1/2 pl-8 flex justify-start items-start pt-4">
                  <Skeleton
                    className="rounded-md"
                    height="28px"
                    width="100px"
                  />
                </div>
              </div>
            </div>

            <div className="flex md:hidden items-start w-full">
              <div className="relative z-10 mr-6">
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
              <div className="flex-1">
                <Skeleton
                  className="mb-3 rounded-md"
                  height="20px"
                  width="100px"
                />
                <Card className="shadow-lg">
                  <CardBody className="p-4">
                    <div className="space-y-3">
                      <Skeleton height="18px" width="180px" />
                      <Skeleton height="16px" width="160px" />
                      <Skeleton height="14px" width="80px" />
                      <Skeleton height="14px" width="100%" />
                      <Skeleton height="14px" width="85%" />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for GitHub integration component
 * @returns GitHub integration skeleton component
 */
export function GithubIntegrationSkeleton() {
  return (
    <Card className="w-full border border-default-200/50 shadow-sm">
      <CardHeader className="flex gap-3 items-center bg-gradient-to-r from-default-50 to-default-100/50 border-b border-default-200/50">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton height="24px" width="180px" />
        <div className="ml-auto">
          <Skeleton className="rounded-md" height="32px" width="140px" />
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-default-200/50">
              <CardBody className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Skeleton className="mb-2" height="20px" width="150px" />
                    <Skeleton className="mb-1" height="16px" width="100%" />
                    <Skeleton height="16px" width="70%" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3].map((j) => (
                      <Skeleton
                        key={j}
                        className="rounded-full"
                        height="20px"
                        width="60px"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-3 h-3 rounded-full" />
                      <Skeleton height="14px" width="60px" />
                    </div>
                    <Skeleton height="14px" width="40px" />
                    <Skeleton height="14px" width="30px" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
      <div className="border-t border-default-200/50 bg-default-50/50 p-4">
        <Skeleton height="16px" width="150px" />
      </div>
    </Card>
  );
}

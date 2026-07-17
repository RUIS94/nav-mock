import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  ListChecks,
  PhoneCall,
  Users2,
  Building2,
  Briefcase,
  FolderOpen,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  Share2,
  BarChart3,
  UserCog,
  UsersRound,
  Contact2,
  DollarSign,
  Lightbulb,
  Settings,
  Plug,
  LogOut,
  UserCircle,
  Coins,
  Mic,
  KeyRound,
  ArrowLeftRight,
  PanelLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import chromeIcon from "@/chrome.svg";
import samLogo from "@/sam.svg";

type NavChild = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type NavSection = { label: string; items: NavChild[] };
type NavIcon = React.ComponentType<{ className?: string }> | string;
type NavItem =
  | {
      title: string;
      url: string;
      icon: NavIcon;
      children?: never;
      sections?: never;
      badge?: string;
      external?: boolean;
    }
  | { title: string; icon: React.ComponentType<{ className?: string }>; children: NavChild[]; sections?: never; url?: never }
  | { title: string; icon: React.ComponentType<{ className?: string }>; sections: NavSection[]; children?: never; url?: never };

const CHROME_EXTENSION_URL = "#";

const workspace: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  {
    title: "Meetings",
    icon: CalendarDays,
    children: [
      { title: "All Meetings", url: "/meetings", icon: CalendarDays },
      { title: "Preparation", url: "/meetings/preparation", icon: Sparkles },
    ],
  },
  { title: "Intelligence", url: "/intelligence", icon: BrainCircuit, badge: "AI" },
  { title: "Tasks", url: "/tasks", icon: ListChecks },
  {
    title: "Sales",
    icon: Briefcase,
    sections: [
      {
        label: "SDR Hub",
        items: [
          { title: "Calls", url: "/sdr/calls", icon: PhoneCall },
          { title: "Shared", url: "/sdr/shared", icon: Share2 },
          { title: "Reports", url: "/sdr/reports", icon: BarChart3 },
        ],
      },
      {
        label: "CRM",
        items: [
          { title: "Contacts", url: "/crm/contacts", icon: Contact2 },
          { title: "Companies", url: "/crm/companies", icon: Building2 },
          { title: "Deals", url: "/crm/deals", icon: Briefcase },
        ],
      },
    ],
  },
  { title: "Sam Drive", url: "/drive", icon: FolderOpen },
];

const admin: NavItem[] = [
  { title: "Integrations", url: "/integrations", icon: Plug },
  {
    title: "Admin",
    icon: ShieldCheck,
    children: [
      { title: "Users", url: "/admin/users", icon: UserCog },
      { title: "Teams", url: "/admin/teams", icon: UsersRound },
      { title: "Clients", url: "/admin/clients", icon: Users2 },
      { title: "Solutions", url: "/admin/solutions", icon: Lightbulb },
      { title: "Billing", url: "/admin/billing", icon: DollarSign },
    ],
  },
];

const extensions: NavItem[] = [
  {
    title: "Get Chrome Extension",
    url: CHROME_EXTENSION_URL,
    icon: chromeIcon,
    external: true,
  },
];

const TEMP_HIDDEN_NAV_TITLES = new Set([
  "Dashboard",
  "Meetings",
  "Tasks",
  "Sales",
  "Integrations",
]);

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visibleWorkspace = workspace.filter((item) => !TEMP_HIDDEN_NAV_TITLES.has(item.title));
  const visibleAdmin = admin.filter((item) => !TEMP_HIDDEN_NAV_TITLES.has(item.title));
  const collapsedItems = [...visibleWorkspace, ...visibleAdmin, ...extensions];
  const [collapsedLogoHovered, setCollapsedLogoHovered] = React.useState(false);
  const [collapsedLogoHoverEnabled, setCollapsedLogoHoverEnabled] = React.useState(true);

  React.useEffect(() => {
    setCollapsedLogoHovered(false);

    if (!collapsed) {
      setCollapsedLogoHoverEnabled(true);
      return;
    }

    setCollapsedLogoHoverEnabled(false);
    const timer = window.setTimeout(() => {
      setCollapsedLogoHoverEnabled(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [collapsed]);

  const isActive = (url: string) => pathname === url;
  const isParentActive = (item: NavItem) => {
    if (item.children) return item.children.some((c) => pathname.startsWith(c.url));
    if (item.sections) return item.sections.some((s) => s.items.some((c) => pathname.startsWith(c.url)));
    return false;
  };

  const renderSubItem = (child: NavChild) => (
    <SidebarMenuSubItem key={child.url}>
      <SidebarMenuSubButton
        asChild
        isActive={isActive(child.url)}
        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
      >
        <Link to={child.url}>
          <child.icon className="h-3.5 w-3.5" />
          <span>{child.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );

  const renderPopoverSubItem = (child: NavChild) => (
    <Link
      key={child.url}
      to={child.url}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-popover-foreground transition-colors hover:bg-muted"
    >
      <child.icon className="h-4 w-4" />
      <span>{child.title}</span>
    </Link>
  );

  const renderIcon = (icon: NavIcon, className = "h-4 w-4") => {
    if (typeof icon === "string") {
      return <img src={icon} alt="" className={`${className} object-contain`} aria-hidden="true" />;
    }

    const Icon = icon;
    return <Icon className={className} />;
  };

  const renderItem = (item: NavItem) => {
    if (item.children || item.sections) {
      const open = isParentActive(item);

      if (collapsed) {
        return (
          <Popover key={item.title}>
            <SidebarMenuItem>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  isActive={open}
                  className="!size-10 justify-center data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                  {renderIcon(item.icon, "h-5 w-5")}
                  <span className="sr-only">{item.title}</span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" sideOffset={10} className="w-64 p-2">
                <div className="mb-2 px-2 text-sm font-semibold text-popover-foreground">{item.title}</div>
                {item.sections ? (
                  <div className="space-y-2">
                    {item.sections.map((section) => (
                      <div key={section.label}>
                        <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {section.label}
                        </div>
                        <div className="space-y-1">{section.items.map(renderPopoverSubItem)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">{item.children!.map(renderPopoverSubItem)}</div>
                )}
              </PopoverContent>
            </SidebarMenuItem>
          </Popover>
        );
      }

      return (
        <Collapsible key={item.title} defaultOpen={open} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                className="data-[state=open]:bg-sidebar-accent"
              >
                {renderIcon(item.icon)}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {item.sections ? (
                <div className="space-y-1 pt-1">
                  {item.sections.map((section) => (
                    <div key={section.label}>
                      <div className="px-3 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {section.label}
                      </div>
                      <SidebarMenuSub>
                        {section.items.map(renderSubItem)}
                      </SidebarMenuSub>
                    </div>
                  ))}
                </div>
              ) : (
                <SidebarMenuSub>
                  {item.children!.map(renderSubItem)}
                </SidebarMenuSub>
              )}
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton
          asChild
          tooltip={collapsed && item.title === "Intelligence" ? undefined : item.title}
          isActive={item.external ? false : isActive(item.url)}
          className={`${collapsed ? "!size-10 justify-center " : ""}data-[active=true]:bg-primary data-[active=true]:text-primary-foreground`}
        >
          {item.external ? (
            <a href={item.url} target="_blank" rel="noreferrer">
              {renderIcon(item.icon, collapsed ? "h-5 w-5" : "h-4 w-4")}
              {collapsed ? <span className="sr-only">{item.title}</span> : <span>{item.title}</span>}
              {item.badge && !collapsed && (
                <Badge className="ml-auto h-5 bg-accent text-accent-foreground hover:bg-accent">
                  {item.badge}
                </Badge>
              )}
            </a>
          ) : (
            <Link to={item.url}>
              {renderIcon(item.icon, collapsed ? "h-5 w-5" : "h-4 w-4")}
              {collapsed ? <span className="sr-only">{item.title}</span> : <span>{item.title}</span>}
              {item.badge && !collapsed && (
                <Badge className="ml-auto h-5 bg-accent text-accent-foreground hover:bg-accent">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };


  // Demo credit values
  const summaryUsed = 23;
  const summaryTotal = 25;
  const avUsed = 470;
  const avTotal = 600;
  const summaryRemaining = Math.max(summaryTotal - summaryUsed, 0);
  const avRemaining = Math.max(avTotal - avUsed, 0);
  const summaryRemainingPct = summaryTotal > 0 ? Math.min((summaryRemaining / summaryTotal) * 100, 100) : 0;
  const avRemainingPct = avTotal > 0 ? Math.min((avRemaining / avTotal) * 100, 100) : 0;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="relative h-12 p-0">
        <div className="absolute top-2 left-2">
          {collapsed ? (
            <button
              type="button"
              className="relative flex h-7 w-12 shrink-0 items-center justify-start overflow-hidden rounded-md p-0 transition-colors hover:bg-muted cursor-pointer"
              aria-label="Expand sidebar"
              onClick={toggleSidebar}
              onMouseEnter={() => {
                if (collapsedLogoHoverEnabled) {
                  setCollapsedLogoHovered(true);
                }
              }}
              onMouseLeave={() => setCollapsedLogoHovered(false)}
            >
              <img
                src={samLogo}
                alt="Sam"
                className={`block w-20 shrink-0 object-contain transition-opacity duration-150 ${
                  collapsedLogoHovered ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
                  collapsedLogoHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </span>
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="flex w-20 shrink-0 items-center justify-start cursor-pointer"
              aria-label="Home"
            >
              <img src={samLogo} alt="Sam" className="block w-20 shrink-0 object-contain" />
            </Link>
          )}
        </div>
        <div
          className={`absolute top-2 right-2 transition-opacity duration-200 ${
            collapsed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted" />
        </div>
      </SidebarHeader>

      <SidebarContent className="relative overflow-hidden">
        <div
          className={`absolute inset-0 overflow-y-auto transition-opacity duration-150 ${
            collapsed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{visibleWorkspace.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{visibleAdmin.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-1 py-2">
            <SidebarGroupLabel>Extensions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{extensions.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div
          className={`absolute inset-0 overflow-y-auto transition-opacity duration-150 ${
            collapsed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <SidebarGroup className="px-0 pt-6 pb-0">
            <SidebarGroupContent>
              <SidebarMenu className="items-center gap-8">{collapsedItems.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-2">
        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex w-full items-center justify-center rounded-md p-2 transition-colors hover:bg-sidebar-accent cursor-pointer"
                aria-label="Account menu"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    AC
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Alex Carter - Tenant A</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    alex@company.com
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile & activity
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/preferences" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/onboarding" className="cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get started guide
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/billing" className="cursor-pointer">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Plan & billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/preferences" className="cursor-pointer">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  Switch account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/preferences" className="cursor-pointer">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Card className="border-0 bg-muted shadow-none">
            <CardContent className="p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent cursor-pointer"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        AC
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col leading-tight">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-sidebar-foreground">
                          Alex Carter
                        </span>
                        <Badge className="h-4 px-1.5 text-[10px] bg-accent text-accent-foreground hover:bg-accent">
                          Starter
                        </Badge>
                      </div>
                      <span className="truncate text-[11px] text-muted-foreground">
                        alex@company.com
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Alex Carter - Tenant A</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        alex@company.com
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile & activity
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/preferences" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/onboarding" className="cursor-pointer">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get started guide
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/billing" className="cursor-pointer">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Plan & billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/preferences" className="cursor-pointer">
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      Switch account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/preferences" className="cursor-pointer">
                      <KeyRound className="mr-2 h-4 w-4" />
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-muted-foreground">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="mt-1 space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Coins className="h-3 w-3" />
                      Summary credits
                    </span>
                    <span className="font-medium text-foreground tabular-nums">
                      {summaryRemaining.toLocaleString()}/{summaryTotal.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={summaryRemainingPct} className="h-1" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Mic className="h-3 w-3" />
                      A/V-to-text
                    </span>
                    <span className="font-medium text-foreground tabular-nums">
                      {avRemaining}/{avTotal} min
                    </span>
                  </div>
                  <Progress value={avRemainingPct} className="h-1" />
                </div>
                <div className="flex justify-center">
                  <Button size="sm" className="mt-4 bg-primary text-sm text-primary-foreground hover:bg-primary/90">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

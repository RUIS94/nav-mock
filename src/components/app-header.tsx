import { useState } from "react";
import { Bell, HelpCircle, Plus, Search, Calculator, Calendar, FileText, CheckSquare, Building2, Handshake, User, Heart, MessageSquare, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const createOptions = [
  { label: "Meeting", icon: Calendar, onClick: () => {} },
  { label: "Transcript", icon: FileText, onClick: () => {} },
  { label: "Task", icon: CheckSquare, onClick: () => {} },
  { label: "Company", icon: Building2, onClick: () => {} },
  { label: "Deal", icon: Handshake, onClick: () => {} },
  { label: "Contact", icon: User, onClick: () => {} },
];

export function CreateNewButton() {
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary hover:bg-muted"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {createOptions.map(({ label, icon: Icon, onClick }) => (
            <DropdownMenuItem key={label} onClick={onClick}>
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <TooltipContent side="bottom" className="bg-muted/60 text-muted-foreground">Create new</TooltipContent>
    </Tooltip>
  );
}

export function AppHeader() {
  const [showLowCreditNotice, setShowLowCreditNotice] = useState(true);

  const summaryUsed = 23;
  const summaryTotal = 25;
  const avUsed = 470;
  const avTotal = 600;
  const summaryRemaining = Math.max(summaryTotal - summaryUsed, 0);
  const avRemaining = Math.max(avTotal - avUsed, 0);
  const shouldShowLowCreditNotice = showLowCreditNotice && (summaryRemaining <= 2 || avRemaining <= 30);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4">
        <div className="relative hidden md:block w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search meetings, contacts, deals…"
            className="h-9 pl-8 bg-muted/40 border-transparent focus-visible:bg-background"
          />
        </div>

        <div className="hidden flex-1 items-center justify-center gap-1.5 md:flex">
          <span className="text-sm text-muted-foreground">We would</span>
          <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-sm text-muted-foreground">to hear your feedback!</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary hover:text-primary hover:bg-muted"
            aria-label="Give feedback"
            title="Give feedback"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button size="sm" className="bg-primary text-sm text-primary-foreground hover:bg-primary/90">
            <span className="hidden sm:inline">Upgrade</span>
          </Button>

          <CreateNewButton />

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Income Calculator"
            title="Income Calculator"
          >
            <Link to="/income-calculator">
              <Calculator className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </Button>
        </div>
      </header>

      {shouldShowLowCreditNotice && (
        <div className="sticky z-20 bg-amber-50">
          <div className="relative flex items-center justify-center px-12 py-2 text-xs text-amber-950">
            <div className="min-w-0 text-center">
              <span className="font-medium">
                You're almost out — {summaryRemaining} summary credits left.{" "}
              </span>
              <Link to="/admin/billing" className="font-medium text-primary hover:text-primary/80">
                See plans
              </Link>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md text-amber-950/70 hover:bg-amber-100 hover:text-amber-950"
              onClick={() => setShowLowCreditNotice(false)}
              aria-label="Dismiss low credit notice"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

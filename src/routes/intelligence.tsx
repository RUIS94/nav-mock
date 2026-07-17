import { createFileRoute } from "@tanstack/react-router";
import EmptyMeetingIntelligence from "@/components/MeetingIntelligence/EmptyMeetingIntelligence";
export const Route = createFileRoute("/intelligence")({
  component: EmptyMeetingIntelligence,
});

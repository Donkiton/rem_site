import DemoPage, { demoMetadata } from "@/components/demo-page";
import { localizedMetadata } from "@/lib/site-metadata";

export function generateMetadata() { return localizedMetadata("ru", demoMetadata); }
export default function Page() { return <DemoPage locale="ru" />; }

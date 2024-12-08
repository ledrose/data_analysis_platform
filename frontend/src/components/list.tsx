import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"

export function ScrollableList({name, data} : {name: string, data: string[]}) {
  return (
    <ScrollArea className="h-72 w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tables</h4>
        {data.map((item, index) => (
          <div key={index} className="text-sm">
            {item}
            {index < data.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
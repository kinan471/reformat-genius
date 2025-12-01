import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GenerationHistoryProps {
  history: any[];
  onLoad: (item: any) => void;
}

export const GenerationHistory = ({ history, onLoad }: GenerationHistoryProps) => {
  return (
    <Card className="border-2 shadow-card h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No generations yet
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => onLoad(item)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </p>
                    <p className="text-sm line-clamp-2">
                      {item.input_content.substring(0, 60)}...
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
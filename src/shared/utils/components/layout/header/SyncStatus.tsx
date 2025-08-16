import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Button } from "@/src/shared/components/ui/button";
import { FiDownload as Download } from "react-icons/fi";
import { LuWifi, LuWifiOff } from "react-icons/lu";
import { GrStorage } from "react-icons/gr";
import { ResetDialog } from "./ResetDialog";

interface SyncStatusProps {
  isOnline: boolean;
  hasLocalChanges: boolean;
  isFetching: boolean;
  showRefreshButton: boolean;
  onFetchFromServer: () => void;
  onReset: () => void;
  hasTodos: boolean;
}

export function SyncStatus({
  isOnline,
  hasLocalChanges,
  isFetching,
  showRefreshButton,
  onFetchFromServer,
  onReset,
  hasTodos,
}: SyncStatusProps) {
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: LuWifiOff,
        text: "Offline",
        bgColor: "bg-red-50/30",
        textColor: "text-red-700",
      };
    }

    if (hasLocalChanges) {
      return {
        icon: GrStorage,
        text: "Local diffs",
        bgColor: "bg-yellow-50/30",
        textColor: "text-yellow-700",
      };
    }

    if (hasTodos) {
      return {
        icon: LuWifi,
        text: "Data loaded",
        bgColor: "bg-green-50/30",
        textColor: "text-green-700",
      };
    }

    return {
      icon: LuWifi,
      text: "Ready to fetch",
      bgColor: "bg-blue-50/30",
      textColor: "text-blue-700",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card
      className={`flex flex-col items-center justify-center shadow-xs overflow-hidden border border-neutral-400/50 ${statusInfo.bgColor} ${statusInfo.textColor} relative h-24 sm:h-28 lg:h-32`}
    >
      <CardContent className="p-3 sm:p-4 w-full h-full flex flex-col justify-center">
        <div
          className={`flex flex-col items-center justify-center ${
            showRefreshButton ? "absolute top-1/5 left-0 right-0" : ""
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base font-medium mb-1">
            <statusInfo.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            Status
          </div>
          <div className="text-xs sm:text-sm lg:text-base font-medium text-center">
            {statusInfo.text}
          </div>
        </div>

        {showRefreshButton && (
          <div className="absolute -bottom-1 sm:bottom-0 left-0 right-0">
            {hasLocalChanges ? (
              <ResetDialog onReset={onReset} isLoading={isFetching} />
            ) : (
              <Button
                onClick={onFetchFromServer}
                loading={isFetching}
                loadingText="Fetching..."
                size="sm"
                fullWidth
                className="handwritten h-6 sm:h-7 lg:h-8 text-xs sm:text-sm lg:text-base bg-[var(--darker)] border-t rounded-b-lg border-neutral-400/50 text-ink hover:bg-[var(--item-focus)]"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Fetch</span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

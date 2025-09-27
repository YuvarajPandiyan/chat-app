import { memo } from "react";

import { cn } from "@/lib/utils";

import { ROLES } from "@/constants/genai/genai";

import { WIDTH } from "../../constants/classNames.constants";

export const MessageWrapper = memo(
  ({ role, children, isStopSteamingConversation }) => {
    return (
      <div
        className={cn("flex", WIDTH, {
          "justify-end": role === ROLES.USER,
          "justify-start": role === ROLES.MODAL,
          "flex-col": isStopSteamingConversation,
        })}
      >
        <div className="min-w-0 ">{children}</div>
        {isStopSteamingConversation && (
          <div className="text-center w-full p-4 bg-gray-100 rounded-2xl">
            The conversation is stopped.
          </div>
        )}
      </div>
    );
  }
);

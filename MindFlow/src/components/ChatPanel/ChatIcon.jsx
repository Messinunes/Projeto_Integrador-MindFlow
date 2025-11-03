import React, { useState } from "react";
import { ChatWrapper, ChatIconButton } from "./ChatStyles";
import ChatPanel from "./ChatPanel";

export default function ChatIcon() {
  const [open, setOpen] = useState(false);

  return (
    <ChatWrapper>
      {open && <ChatPanel />}
      <ChatIconButton onClick={() => setOpen(!open)}>
        💬
      </ChatIconButton>
    </ChatWrapper>
  );
}
    
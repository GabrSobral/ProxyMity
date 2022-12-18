import { Message } from "./Message";

export function MessageContainer() {
  return (
    <section className="flex flex-1 flex-col gap-1 p-4">
      <Message 
        content="Text message test" 
        receivedAt={new Date()} 
        writtenAt={new Date()}
        isMine
      />

      <Message 
        content="Text message test" 
        receivedAt={new Date()} 
        writtenAt={new Date()}
        isMine={false}
      />
    </section>
  )
}
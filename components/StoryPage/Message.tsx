import { TrashIcon } from "@heroicons/react/24/outline";
import { Message as MessageComponent } from "@prisma/client";

type Props = {
  message: MessageComponent;
  deleteMessage: (messageId: string) => void;
};

function MessageComponent({ message, deleteMessage }: Props) {
  const DeleteMessage = async () => {
    const res = await fetch(`/api/message/?messageId=${message.id}`, {
      //TODO: Make sure it's taken out of the UI
      method: "DELETE",
    });

    if (res.ok) {
      // remove message from UI
      deleteMessage(message.id);
    }

    // router.push("/");
  };

  return (
    <div className={`py-5 text-white`}>
      <div className="flex space-x-5 px-10 max-w-4xl mx-auto">
        <div className="flex-1 text-left">
          <div className=" text-sm whitespace-pre-wrap">
            {message.authorId} said: {message.content}
          </div>
        </div>

        <div className="flex items-center">
          <TrashIcon
            onClick={DeleteMessage}
            className="h-5 w-5 text-gray-500 hover:text-red-700"
          />
        </div>
      </div>
    </div>
  );
}

export default MessageComponent;

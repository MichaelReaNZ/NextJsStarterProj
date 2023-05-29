import { TrashIcon } from "@heroicons/react/24/outline";
import { Message as MessageComponent } from "@prisma/client";

type Props = {
  message: MessageComponent;
};

function MessageComponent({ message }: Props) {
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
            onClick={() => alert("Delete Message not implemented.")}
            className="h-5 w-5 text-gray-500 hover:text-red-700"
          />
        </div>
      </div>
    </div>
  );
}

export default MessageComponent;

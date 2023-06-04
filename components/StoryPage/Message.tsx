import { TrashIcon } from "@heroicons/react/24/outline";
import { Message } from "@prisma/client";

type Props = {
  message: Message;
  deleteMessage: (messageId: string) => void;
  index: number;
  storyId: string;
  addMessage: (newMessage: Message) => void;
};

function MessageComponent({
  message,
  deleteMessage,
  addMessage,
  index,
  storyId,
}: Props) {
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

  const messageColor = index % 2 === 0 ? "bg-gray" : "bg-gray-700";

  const handleChoice = async (choiceLetter: string) => {
    const prompt = `I choose ${choiceLetter}.`;

    const newMessage: Message = {
      id: Math.random().toString(),
      content: prompt,
      storyId: storyId,
      authorId: "Michael",
      role: "user",
      choiceA: null,
      choiceB: null,
      createdAt: new Date(),
    };

    //Show that this button is selected
    //Disable the buttons

    const body = {
      message: newMessage,
      storyId: storyId,
    };

    const res = await fetch("/api/message", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await res.json();
    console.log(responseData.aiReplyMessage);

    //Add the response ass a message also
    addMessage(responseData.aiReplyMessage);
  };

  return (
    <div className={`py-5 text-white ${messageColor}`}>
      <div className="flex space-x-5 px-10 max-w-4xl mx-auto">
        <div className="flex-1 text-left">
          <div className=" text-base whitespace-pre-wrap">
            {message.content}
          </div>
          <br />
          <div>
            {message.choiceA && (
              <button
                type="submit"
                className="bg-[#ffffff] hover:opacity-50 text-black
                 font-bold
                px-4 py-2 rounded disabled:bg-gray-300
                disabled:cursor-not-allowed"
                onClick={() => handleChoice("A")}
              >
                A: {message.choiceA}
              </button>
            )}
            <br />
            {message.choiceB && (
              <button
                type="submit"
                className="bg-[#ffffff] hover:opacity-50 text-black
                 font-bold
                px-4 py-2 mt-4 rounded disabled:bg-gray-300
                disabled:cursor-not-allowed"
                onClick={() => handleChoice("B")}
              >
                B: {message.choiceB}
              </button>
            )}
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

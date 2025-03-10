import React, { useEffect, useRef, useState } from "react";
import { UseAuthStore } from "../store/Auth.Store";
import { LuCross, LuLink, LuMessageSquareMore } from "react-icons/lu";
import { LuSendHorizontal } from "react-icons/lu";
import EmojiPicker from "emoji-picker-react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useMessageStore } from "../store/messages.store";
import { useProfileStore } from "../store/profile.store";

const ChatPage = () => {
    const { getAllUsers, profiles } = UseAuthStore();
    const { userProfile } = useProfileStore();
    const { sendMessages, getMessages, messages } = useMessageStore();

    const emojiRef = useRef(null);
    const inputRef = useRef(null);
    const messageRef = useRef(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [message, setMessage] = useState("");
    const [media, setMedia] = useState("");
    const [typing, setTyping] = useState(false);
    const [showUsersPage, setShowUsersPage] = useState(true);
    const [showChatPage, setShowChatPage] = useState(false);

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setMedia(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleClosePreview = () => {
        setMedia("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleSubmit = (e, id, text, photo) => {
        e.preventDefault();
        sendMessages(id, text, photo);
        setMessage("");
    };

    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const handleCloseEmoji = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setShowEmoji(false);
            }
        };

        document.addEventListener("mousedown", handleCloseEmoji);

        return () => document.removeEventListener("click", handleCloseEmoji);
    }, []);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);
    return (
        <div className="max-w-7xl mx-auto shadow-sm shadow-black/30 min-h-[90vh] flex rounded-md">
            <div
                className="w-full md:w-[25%]"
                style={{
                    display: `${showUsersPage ? "block" : "none"}`,
                }}
            >
                <h1 className="text-white font-bold text-3xl my-2">
                    All Users
                </h1>
                <hr className=" text-white w-full mx-auto" />
                <div className="w-full h-full flex items-center justify-center flex-col">
                    {profiles.length > 0 ? (
                        <div className="w-full h-full">
                            {profiles.map((profile) => (
                                <div
                                    className={`w-full px-1 py-2 flex gap-2 my-2 border-b border-b-black/30 cursor-pointer hover:bg-black/20 ${
                                        selectedUser?._id === profile._id
                                            ? "bg-black/20"
                                            : "bg-transparent"
                                    }`}
                                    key={profile.userId}
                                    onClick={() => {
                                        setSelectedUser(profile);
                                        getMessages(profile.userId);
                                        setShowUsersPage(false);
                                        setShowChatPage(true);
                                    }}
                                >
                                    <img
                                        src={profile.profileImage}
                                        alt="pofile image"
                                        className="w-[40px] h-[40px] rounded-full"
                                    />
                                    <h1 className="text-white font-bold text-xl my-2">
                                        {profile.name}
                                    </h1>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h1 className="text-white font-bold text-sm md:text-3xl my-2 text-center">
                            No users found currently 😥
                        </h1>
                    )}
                </div>
            </div>
            <div
                className="w-full md:w-[75%] max-h-[90vh] shadow shadow-black/30 relative"
                style={{
                    display: `${showChatPage ? "block" : "none"}`,
                }}
            >
                {selectedUser ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="w-full flex h-[8%] justify-start items-center gap-x-2 p-2 shadow-sm shadow-black/40">
                            <img
                                src={selectedUser.profileImage}
                                alt="pofile image"
                                className="w-[40px] h-[40px] rounded-full"
                            />
                            <h1 className="text-white font-bold text-xl">
                                {selectedUser.name}
                            </h1>
                            <button
                                className="justify-self-end font-bold text-white"
                                onClick={() => {
                                    setShowChatPage(false);
                                    setShowUsersPage(true);
                                }}
                            >
                                <RxCross2 size={28} />
                            </button>
                        </div>
                        <div className="w-full h-[84%] p-2 overflow-y-scroll bottom-0">
                            {messages.length > 0 ? (
                                messages.map((mess) => (
                                    <div
                                        className={`chat ${
                                            mess.receiver ===
                                            selectedUser.userId
                                                ? "chat-end"
                                                : "chat-start"
                                        }`}
                                        ref={messageRef}
                                        key={mess._id}
                                    >
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                                <img
                                                    alt="Tailwind CSS chat bubble component"
                                                    src={
                                                        mess.receiver ===
                                                        selectedUser.userId
                                                            ? userProfile.profileImage
                                                            : selectedUser.profileImage
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={`chat-bubble ${
                                                mess.receiver ===
                                                selectedUser.userId
                                                    ? "bg-[var(--primary)]/60 text-white"
                                                    : "bg-[var(--neutral)] text-white"
                                            }`}
                                        >
                                            {mess.image ? (
                                                <a href={mess.image} download>
                                                    <img
                                                        src={mess.image}
                                                        alt="message image"
                                                        className="w-[150px] h-[150px]"
                                                    />
                                                </a>
                                            ) : (
                                                ""
                                            )}
                                            {mess.message}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full h-full flex justify-center items-center flex-col">
                                    <p className="text-white font-light text-sm">
                                        No conversition
                                    </p>
                                    <h1 className="text-white font-bold text-xl">
                                        Start a conversition with{" "}
                                        {selectedUser.name}
                                    </h1>
                                </div>
                            )}
                        </div>
                        <hr className="text-white" />
                        <form
                            className="w-full h-[8%] relative"
                            onSubmit={(e) => {
                                handleSubmit(
                                    e,
                                    selectedUser.userId,
                                    message,
                                    media,
                                );
                                setMedia("");
                            }}
                        >
                            <label className="flex justify-between items-center px-3 w-full h-full bg-neutral/30 outline-none gap-2 ">
                                <div className="flex justify-center items-center">
                                    <label
                                        htmlFor="image"
                                        className="text-white font-bold cursor-pointer"
                                    >
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleUpload}
                                            id="image"
                                            ref={inputRef}
                                        />
                                        <LuLink size={28} />
                                    </label>
                                </div>
                                {media && (
                                    <div className="absolute bottom-16 left-2 z-30 w-[150px] h-[150px]">
                                        <img
                                            src={media}
                                            alt="preview image"
                                            className="w-full h-full relative"
                                        />
                                        <button
                                            className="text-white font-bold cursor-pointer top-0 right-0 absolute"
                                            onClick={handleClosePreview}
                                        >
                                            <RxCross2 size={20} />
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                    }}
                                    className="grow placeholder:text-[var(--neutral_text)] outline-none text-white text-lg font-light h-full"
                                    placeholder="Type a message"
                                />
                                <div className="flex justify-center items-center gap-3">
                                    <button
                                        className="text-white font-bold cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowEmoji((prev) => !prev);
                                        }}
                                    >
                                        <MdOutlineEmojiEmotions size={32} />
                                    </button>
                                    <button
                                        className="text-white font-bold cursor-pointer"
                                        type="submit"
                                    >
                                        <LuSendHorizontal size={32} />
                                    </button>
                                </div>
                            </label>
                            {showEmoji && (
                                <div
                                    className="absolute bottom-16 right-2 z-10"
                                    ref={emojiRef}
                                >
                                    <EmojiPicker
                                        onEmojiClick={handleEmojiClick}
                                        width={300}
                                        height={350}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        <h1 className="text-white font-bold text-3xl my-2 text-center flex justify-center items-center flex-col">
                            Select a user to start a conversation{" "}
                            <LuMessageSquareMore size={32} />{" "}
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;

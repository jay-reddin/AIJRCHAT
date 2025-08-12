import { RotateCcw, Copy, Trash2 } from "lucide-react";

export default function MessageActions({ message, onResend, onCopy, onDelete }) {
  return (
    <div
      className={`flex gap-2 mt-2 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <button
        onClick={() => onResend(message.content)}
        className="p-1.5 rounded opacity-60 hover:opacity-100 transition-opacity"
        title="Resend"
      >
        <RotateCcw size={14} />
      </button>
      <button
        onClick={() => onCopy(message.content)}
        className="p-1.5 rounded opacity-60 hover:opacity-100 transition-opacity"
        title="Copy"
      >
        <Copy size={14} />
      </button>
      <button
        onClick={() => onDelete(message.id)}
        className="p-1.5 rounded opacity-60 hover:opacity-100 transition-opacity text-red-400"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

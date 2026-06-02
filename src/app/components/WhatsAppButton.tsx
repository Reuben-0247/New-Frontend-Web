import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/+2347066574746?text=Hello%20Fero%20Event%2C%20I%20have%20a%20question%20about%20your%20services."
      target="_blank"
      title="Contact Fero Events on WhatsApp"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#09d14c] text-[#1b2e1a] p-4 rounded-full shadow-[0_4px_20px_rgba(166,198,37,0.4)] hover:bg-[#44bb40] hover:text-white transform hover:scale-110 transition-all"
      aria-label="Contact Fero Events via WhatsApp">
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}

exports.ModerationLog = {

};

exports.ModerationLog.Types = {
    WARN: { hex: 0xFFFF00, display: "Warn" },
    PURGE: { hex: 0xFFFF00, display: "Message Purge" },
    TEMP_MUTE: { hex: 0xFF9900, display: "Temporary Mute" },
    MUTE: { hex: 0xFF9900, display: "Mute" },
    TEMP_VOICE_MUTE: { hex: 0xFF9900, display: "Temporary Voice Mute" },
    VOICE_MUTE: { hex: 0xFF9900, display: "Voice Mute" },
    KICK: { hex: 0xFF3300, display: "Kick" },
    VOICE_KICK: { hex: 0xFF3300, display: "Voice Kick" },
    SOFTBAN: { hex: 0xFF2F00, display: "Softban" },
    TEMP_BAN: { hex: 0xFF0000, display: "Temporary Ban" },
    BAN: { hex: 0xFF0000, display: "Ban" },
    UNMUTE: { hex: 0x006699, display: "Unmute" },
    UNBAN: { hex: 0x006699, display: "Unban" }
};

exports.ModerationLog.Regex = {
    ACTION: /\*\*Action:\*\*\s.+/gi,
    USER: /\*\*(?:User|Channel):\*\*\s.+/gi,
    REASON: /\*\*Reason:\*\*\s.+/gi
};
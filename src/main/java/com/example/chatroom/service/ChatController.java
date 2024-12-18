package com.example.chatroom.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import java.util.List;
@Controller
public class ChatController {
	@Autowired
	MessageServ serv;
	@MessageMapping("chat.sendMessage")
	@SendTo("/topic/chat")
	public Message sendMsg(@Payload Message msg) {
		serv.createMessage(msg);
		return msg;
	}
	@MessageMapping("chat.addUser")
	@SendTo("/topic/chat")
	public Message addUser(@Payload Message msg, SimpMessageHeaderAccessor headerAccessor) {
		headerAccessor.getSessionAttributes().put("username", msg.getSender());
		return msg;
	}
	@MessageMapping("chat.getOldMessages")
	@SendTo("/topic/chat.oldMessages")
	public List<Message> getOldMessages() {
		try {
			return serv.findAllMessages();
		} catch (RuntimeException e) {
			// Log error if needed
			throw new RuntimeException("Error retrieving old messages", e);
		}
	}
}
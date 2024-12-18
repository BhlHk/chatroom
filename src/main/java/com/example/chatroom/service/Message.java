package com.example.chatroom.service;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Data;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idMessage; // Changed to Long for better scalability

	private MsgType type;   // Enum to represent the type of message (JOIN, LEAVE, MESSAGE)

	private String content; // Content of the message

	private String sender;  // Username of the sender

	public Long getIdMessage() {
		return idMessage;
	}

	public void setIdMessage(Long idMessage) {
		this.idMessage = idMessage;
	}

	public MsgType getType() {
		return type;
	}

	public void setType(MsgType type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}
	public static class Builder {
		private MsgType type;
		private String sender;
		private String content;

		public Builder type(MsgType type) {
			this.type = type;
			return this;
		}

		public Builder sender(String sender) {
			this.sender = sender;
			return this;
		}

		public Builder content(String content) {
			this.content = content;
			return this;
		}

		public Message build() {
			Message message = new Message();
			message.setType(this.type);
			message.setSender(this.sender);
			message.setContent(this.content);
			return message;
		}
	}

	public static Builder builder() {
		return new Builder();
	}
}

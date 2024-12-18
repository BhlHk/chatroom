package com.example.chatroom.config;
import java.util.Objects;
import com.example.chatroom.service.Message;
import com.example.chatroom.service.MsgType;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class WebSocketEventListener {
    private static final Logger log = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final SimpMessageSendingOperations messagOperations;

    public WebSocketEventListener(SimpMessageSendingOperations messagOperations) {
        this.messagOperations = messagOperations;
    }
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (Objects.nonNull(username)) {
            log.info("User disconnected: {}", username);
            messagOperations.convertAndSend("/topic/chat",
                    Message.builder().type(MsgType.LEAVE).sender(username).build());
        }
    }
}

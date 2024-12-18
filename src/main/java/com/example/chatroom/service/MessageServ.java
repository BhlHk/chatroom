package com.example.chatroom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class MessageServ {

    private final List<String> connectedUsers = new ArrayList<>();

    @Autowired
    MessageRepo messageRepo;
    public Message createMessage(Message message) {
        try{
            return messageRepo.save(message);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<Message> findAllMessages(){
        try{
            return messageRepo.findAll();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

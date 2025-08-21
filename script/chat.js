$(document).ready(async function() {
    const apiKey = 'gjp3ycatuazs';
    const userId = 'EV6vcyIdFtV42RfDUQbUfFV7dlw1';
    const apiSecret = '5ybdnxv26rnu8waqrqtapfgptuuu3bhqpg245nfegdcdtd2zarzr57yty9bc63mk';
    const client = StreamChat.getInstance(apiKey);

    await client.connectUser({ id: userId, name: 'Nome do Usuário' }, client.devToken(userId, { secret: apiSecret }));

    async function loadConversations() {
        const conversationList = $('#conversation-list');
        conversationList.empty();

        const filter = { type: 'messaging', members: { $in: [userId] } };
        const sort = { last_message_at: -1 };
        const channels = await client.queryChannels(filter, sort, { limit: 10 });

        channels.forEach(channel => {
            const lastMessage = channel.state.messages[channel.state.messages.length - 1];
            const listItem = `
                <li class="list-group-item list-group-item-action" data-channel-id="${channel.id}">
                    <div class="d-flex align-items-center">
                        <img src="../assets/img/pet.png" alt="Perfil" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                        <div>
                            <h6 class="mb-0">${channel.data.name || 'Desconhecido'}</h6>
                            <p class="mb-0 text-muted">${lastMessage ? lastMessage.text : 'Nenhuma mensagem'}</p>
                        </div>
                    </div>
                </li>
             `;
            conversationList.append(listItem);
        });
    }

    async function loadMessages(channelId) {
        const chatMessages = $('#chat-messages');
        chatMessages.empty();
        
        const channel = client.channel('messaging', channelId);
        await channel.watch();

        $('#chat-title').text(channel.data.name || 'Chat');
        $('#chat-profile-img').attr('src', '../assets/img/pet.png');

        channel.state.messages.forEach(msg => {
            const messageClass = msg.user.id === userId ? 'sent' : 'received';
            const messageHtml = `<div class="message ${messageClass}">${msg.text}</div>`;
            chatMessages.append(messageHtml);
        });
        chatMessages.scrollTop(chatMessages[0].scrollHeight);

        channel.on('message.new', event => {
            const messageClass = event.message.user.id === userId ? 'sent' : 'received';
            const messageHtml = `<div class="message ${messageClass}">${event.message.text}</div>`;
            chatMessages.append(messageHtml);
            chatMessages.scrollTop(chatMessages[0].scrollHeight);
        });
    }
    
    function toggleMobileView(showChat) {
        const chatList = $('#chat-list');
        const chatArea = $('#chat-area');
        
        if (showChat) {
            chatList.addClass('mobile-hidden');
            chatArea.removeClass('d-none').addClass('mobile-shown');
        } else {
            chatList.removeClass('mobile-hidden');
            chatArea.addClass('d-none').removeClass('mobile-shown');
        }
    }

    function toggleMobileView(showChat) {
        const chatList = $('#chat-list');
        const chatArea = $('#chat-area');
        
        if (showChat) {
            chatList.addClass('d-none');
            chatArea.removeClass('d-none');
        } else {
            chatList.removeClass('d-none');
            chatArea.addClass('d-none');
        }
    }

    $(document).on('click', '.list-group-item', function() {
        const channelId = $(this).data('channel-id');
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');
        $('#chat-start-message').addClass('d-none');
        $('#chat-content').removeClass('d-none');
        loadMessages(channelId);
        if ($(window).width() < 768) {
            toggleMobileView(true);
        }
    });

    $('#send-button').on('click', async function() {
        const messageInput = $('#message-input');
        const messageText = messageInput.val().trim();
        const activeChannelId = $('.list-group-item.active').data('channel-id');

        if (messageText !== '' && activeChannelId) {
            try {
                const channel = client.channel('messaging', activeChannelId);
                await channel.sendMessage({ text: messageText });
                messageInput.val('');
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        }
    });

    $('#message-input').keypress(function(e) {
        if(e.which === 13) {
            $('#send-button').click();
        }
    });

    loadConversations();
});
$(document).ready(async function() {
    const apiKey = 'gjp3ycatuazs';
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    const streamJwt = localStorage.getItem('stream_jwt');
    
    if (!userId || !streamJwt) {
        alert('Usuário não autenticado no chat!');
        window.location.href = '/deuPetWeb/pages/login.html';
        return;
    }

    const client = StreamChat.getInstance(apiKey);
    await client.connectUser(
        { id: userId, name: userName },
        streamJwt
    );

    client.on('message.new', event => {
        loadConversations();
    });

    async function loadConversations() {
        const conversationList = $('#conversation-list');
        conversationList.empty();

        const filter = { type: 'messaging', members: { $in: [userId] } };
        const sort = { last_message_at: -1 };
        const channels = await client.queryChannels(filter, sort, { limit: 10 });

        if (channels.length === 0) {
            $('#chat-start-message').removeClass('d-none');
            $('#chat-content').addClass('d-none');
            $('#chat-start-text').text('Nenhum match realizado.');
            return;
        } else {
            $('#chat-start-text').text('Selecione uma conversa.');
        }

        channels.forEach(channel => {
            const lastMessage = channel.state.messages[channel.state.messages.length - 1];
            const unread = channel.countUnread();
            const unreadClass = unread > 0 ? 'unread' : '';
            const badge = unread > 0
                ? `<span class="badge bg-danger ms-2">${unread}</span>`
                : '';
            const listItem = `
                <li class="list-group-item list-group-item-action ${unreadClass}" data-channel-id="${channel.id}">
                    <div class="d-flex align-items-center">
                        <img src="${channel.data.image || '../assets/img/pet.png'}" alt="Perfil" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                        <div>
                             <h6 class="mb-0">
                                ${channel.data.name || 'Desconhecido'}
                                ${badge}
                            </h6>
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
        await channel.markRead();

        $('#chat-title').text(channel.data.name || 'Chat');
        $('#chat-profile-img').attr('src', channel.data.image || '../assets/img/pet.png');

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

    $('#back-button').on('click', function() {
        toggleMobileView(false);
    });

    loadConversations();
});
function getMockWhatsAppConversations() {
  return [
    {
      id: "conv_wa_1",
      channel: "whatsapp",
      externalConversationId: "wa_1001",
      customer: {
        id: "cust_wa_1",
        name: "María Fernández",
        externalUserId: "54911xxxx0001",
      },
      subject: "Consulta por terapia individual",
      lastMessage: "Quería saber honorarios y disponibilidad para la semana próxima.",
      status: "new",
      updatedAt: "2026-03-12T10:00:00Z",
      messages: [
        {
          id: "msg_wa_1",
          direction: "inbound",
          from: "customer",
          text: "Hola, quería consultar por terapia individual.",
          sentAt: "2026-03-12T09:55:00Z",
          channel: "whatsapp",
        },
        {
          id: "msg_wa_2",
          direction: "inbound",
          from: "customer",
          text: "Quería saber honorarios y disponibilidad para la semana próxima.",
          sentAt: "2026-03-12T10:00:00Z",
          channel: "whatsapp",
        },
      ],
    },
  ];
}

module.exports = {
  getMockWhatsAppConversations,
};

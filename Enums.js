class Enums {
    static Acoes = {
        SOLICITA: ['Solicita', 'solicita'],
        RELATA: ['Relata', 'relata']
    };

    static Solicitacoes = {
        CANCELAMENTO: ['Cancelamento', 'cancelamento de seu plano'],
        INFORMACOES: ['Informações', 'informações sobre'],
        REMOCAO_CGNAT: ['Remoção de CGNAT', 'remoção de CGNAT'],
        REDIRECIONAMENTO_DE_PORTA: ['Redirecionamento de Porta', 'redirecionamento de porta'],
        DMZ: ['Configuração de DMZ', 'configuração de DMZ']
    };

    static MotivosCancelamento = {
        FATURA_CARA: ['Fatura Cara', 'fatura estar cara'],
        MA_QUALIDADE_SINAL: ['Má Qualidade do Sinal', 'má qualidade do sinal'],
        MA_QUALIDADE_OM: ['Má Qualidade do Setor O&M', 'má qualidade do setor O&M'],
        OUTRO: ['Outro', 'outro']
    };

    static Setores = {
        COMERCIAL: ['Comercial', 'Setor Comercial'],
        COBRANCA: ['Cobrança', 'Setor Cobrança'],
        RETENCAO: ['Retenção', 'Setor Retenção']
    };

    static Mensagens = {
        SOLICITA: (acao) => `solicita ${acao}`,
        RELATA: (acao) => `relata ${acao}`,
        REDIRECIONAMENTO_DE_PORTA: (ip, porta) => `IP ${ip} redirecionado para porta ${porta}`,
        DMZ: (ip) => `DMZ configurado com sucesso para IP ${ip}`,
        CANCELAMENTO: (motivo, retencao, resolvido, transferido, setor) => 
            `cancelamento devido a ${motivo}. Ofereço ${retencao}${resolvido ? ', e cliente aceita oferta' : ', porém, cliente persiste em cancelar'}${transferido ? ', transferido para setor ' + setor : ''}.`,
        INFORMACOES: (solicitacao, resposta) => `Solicita informações a respeito de ${solicitacao}. Informo a cliente que ${resposta}`,
        REMOCAO_CGNAT: (motivo) => `Remoção de CGNAT devido a ${motivo}`
    };
}
document.addEventListener('DOMContentLoaded', () => {
    const nomeInput = document.getElementById('nome');
    const tipoDocumentoSelect = document.getElementById('tipoDocumento');
    const acaoSelect = document.getElementById('acao');
    const detalhesAcaoDiv = document.getElementById('detalhesAcao');
    const resultadoDiv = document.getElementById('resultado');
    let acoesFeitas = [];

    const updateResultado = () => {
        const nome = nomeInput.value;
        const resultado = acoesFeitas.map(acao => acao()).join('\n');
        resultadoDiv.textContent = `${nome} ${resultado}`;
    };

    const addAcaoFeita = (acao) => {
        acoesFeitas.push(acao);
        updateResultado();
    };

    const createInput = (placeholder) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.addEventListener('input', updateResultado);
        return input;
    };

    const createCheckbox = (labelText) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', updateResultado);
        const label = document.createElement('label');
        label.textContent = labelText;
        return { checkbox, label };
    };

    const createSelect = (options, enumType) => {
        const select = document.createElement('select');
        select.dataset.enum = enumType;
        select.innerHTML = `<option value="">Escolha</option>` + options.map(option => `<option value="${option}">${Enums[enumType][option][0]}</option>`).join('');
        select.addEventListener('change', updateResultado);
        return select;
    };

    acaoSelect.addEventListener('change', () => {
        const acao = acaoSelect.value;
        detalhesAcaoDiv.innerHTML = '';

        if (acao === 'SOLICITA') {
            const solicitacaoSelect = createSelect(Object.keys(Enums.Solicitacoes), 'Solicitacoes');
            solicitacaoSelect.addEventListener('change', () => {
                const solicitacao = solicitacaoSelect.value;
                detalhesAcaoDiv.innerHTML = '';
                if (solicitacao) {
                    detalhesAcaoDiv.appendChild(document.createTextNode(`Contexto: ${Enums.Solicitacoes[solicitacao][1]}`));
                }

                if (solicitacao === 'REDIRECIONAMENTO_DE_PORTA') {
                    const portaInput = createInput('Porta');
                    const ipInput = createInput('IP');
                    const addButton = document.createElement('button');
                    addButton.textContent = '+ Porta';
                    addButton.addEventListener('click', () => {
                        const newPortaInput = createInput('Porta');
                        const newIpInput = createInput('IP');
                        detalhesAcaoDiv.appendChild(newPortaInput);
                        detalhesAcaoDiv.appendChild(newIpInput);
                        addAcaoFeita(() => Enums.Mensagens.REDIRECIONAMENTO_DE_PORTA(newIpInput.value, newPortaInput.value));
                    });
                    const { checkbox: sucessoCheckbox, label: sucessoLabel } = createCheckbox('Sucesso');
                    
                    detalhesAcaoDiv.appendChild(portaInput);
                    detalhesAcaoDiv.appendChild(ipInput);
                    detalhesAcaoDiv.appendChild(addButton);
                    detalhesAcaoDiv.appendChild(sucessoCheckbox);
                    detalhesAcaoDiv.appendChild(sucessoLabel);
                    
                    updateResultado();
                } else if (solicitacao === 'DMZ') {
                    const ipInput = createInput('IP');
                    const { checkbox: sucessoCheckbox, label: sucessoLabel } = createCheckbox('DMZ configurado com sucesso');

                    detalhesAcaoDiv.appendChild(ipInput);
                    detalhesAcaoDiv.appendChild(sucessoCheckbox);
                    detalhesAcaoDiv.appendChild(sucessoLabel);

                    addAcaoFeita(() => Enums.Mensagens.DMZ(ipInput.value));
                } else if (solicitacao === 'CANCELAMENTO') {
                    const motivoSelect = createSelect(Object.keys(Enums.MotivosCancelamento), 'MotivosCancelamento');
                    const retencaoInput = createInput('Ação para reter cliente');
                    const { checkbox: transferidoCheckbox, label: transferidoLabel } = createCheckbox('Transferido para retenção');
                    const { checkbox: resolvidoCheckbox, label: resolvidoLabel } = createCheckbox('Resolvido no suporte');
                    const setorSelect = createSelect(Object.keys(Enums.Setores), 'Setores');
                    const outroMotivoInput = createInput('Motivo');

                    motivoSelect.addEventListener('change', () => {
                        if (motivoSelect.value === 'OUTRO') {
                            detalhesAcaoDiv.appendChild(outroMotivoInput);
                        } else {
                            if (detalhesAcaoDiv.contains(outroMotivoInput)) {
                                detalhesAcaoDiv.removeChild(outroMotivoInput);
                            }
                        }
                        updateResultado();
                    });

                    detalhesAcaoDiv.appendChild(motivoSelect);
                    detalhesAcaoDiv.appendChild(retencaoInput);
                    detalhesAcaoDiv.appendChild(transferidoCheckbox);
                    detalhesAcaoDiv.appendChild(transferidoLabel);
                    detalhesAcaoDiv.appendChild(resolvidoCheckbox);
                    detalhesAcaoDiv.appendChild(resolvidoLabel);
                    detalhesAcaoDiv.appendChild(setorSelect);

                    addAcaoFeita(() => Enums.Mensagens.CANCELAMENTO(
                        motivoSelect.value,
                        retencaoInput.value,
                        resolvidoCheckbox.checked,
                        transferidoCheckbox.checked,
                        setorSelect.value
                    ));
                } else if (solicitacao === 'INFORMACOES') {
                    const solicitacaoInput = createInput('Solicitação');
                    const respostaInput = createInput('Resposta');

                    detalhesAcaoDiv.appendChild(solicitacaoInput);
                    detalhesAcaoDiv.appendChild(respostaInput);

                    addAcaoFeita(() => Enums.Mensagens.INFORMACOES(solicitacaoInput.value, respostaInput.value));
                } else if (solicitacao === 'REMOCAO_CGNAT') {
                    const motivoInput = createInput('Motivo');

                    detalhesAcaoDiv.appendChild(motivoInput);

                    addAcaoFeita(() => Enums.Mensagens.REMOCAO_CGNAT(motivoInput.value));
                }
                updateResultado();
            });
            detalhesAcaoDiv.appendChild(solicitacaoSelect);
        }
        updateResultado();
    });

    nomeInput.addEventListener('input', updateResultado);
    tipoDocumentoSelect.addEventListener('change', updateResultado);
});
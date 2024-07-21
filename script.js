document.addEventListener('DOMContentLoaded', () => {
    const nomeInput = document.getElementById('nome');
    const detalhesAcaoDiv = document.getElementById('detalhesAcao');
    const resultadoDiv = document.getElementById('resultado');
    const toggleThemeButton = document.getElementById('toggle-theme');
    let blocos = [];

    class Bloco {
        constructor(inputs, outputFunc) {
            this.inputs = inputs;
            this.outputFunc = outputFunc;
            this.element = this.createElement();
        }

        createElement() {
            const blocoDiv = document.createElement('div');
            blocoDiv.className = 'bloco';

            this.inputs.forEach(input => blocoDiv.appendChild(input));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                blocos = blocos.filter(bloco => bloco !== this);
                blocoDiv.remove();
                updateResultado();
            });

            blocoDiv.appendChild(deleteButton);
            return blocoDiv;
        }

        getOutput() {
            return this.outputFunc(this.inputs);
        }
    }

    class BlocoRedirecionamentoDePorta extends Bloco {
        constructor() {
            const portaInput = createInput('Porta');
            portaInput.type = 'number';
            portaInput.min = '0';
            portaInput.max = '65535';

            const ipInput = createInput('IP');
            ipInput.pattern = '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
            ipInput.title = 'Digite um endereço IPv4 válido (ex: 192.168.0.1)';

            const { checkbox: sucessoCheckbox, label: sucessoLabel, container: sucessoContainer } = createCheckbox('Sucesso');
            const addPortaButton = document.createElement('button');
            addPortaButton.textContent = 'Adicionar Porta';
            addPortaButton.className = 'add-porta-button';

            const portasDiv = document.createElement('div');
            portasDiv.appendChild(portaInput);
            portasDiv.appendChild(ipInput);

            addPortaButton.addEventListener('click', () => {
                const novaPortaInput = createInput('Porta');
                novaPortaInput.type = 'number';
                novaPortaInput.min = '0';
                novaPortaInput.max = '65535';

                const novoIpInput = createInput('IP');
                novoIpInput.pattern = '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
                novoIpInput.title = 'Digite um endereço IPv4 válido (ex: 192.168.0.1)';
                novoIpInput.value = ipInput.value; // Predefinir o IP

                portasDiv.appendChild(novaPortaInput);
                portasDiv.appendChild(novoIpInput);
            });

            super([portasDiv, sucessoContainer, addPortaButton], (inputs) => {
                const portas = [];
                for (let i = 0; i < portasDiv.children.length; i += 2) {
                    portas.push(`\n     - IP ${portasDiv.children[i + 1].value} redirecionado para a porta ${portasDiv.children[i].value};`);
                }
                return `solicita redirecionamento de Porta: ${portas.join('')}\n     *${inputs[2].checked ? 'Redirecionamento feito com sucesso' : 'Porém não foi possível realizar o redirecionamento'}`;
            });
        }
    }

    class BlocoDMZ extends Bloco {
        constructor() {
            const ipInput = createInput('IP');
            const { checkbox: sucessoCheckbox, label: sucessoLabel, container: sucessoContainer } = createCheckbox('DMZ configurado com sucesso');
            super([ipInput, sucessoContainer], (inputs) => `solicita DMZ de suas portas para IP ${inputs[0].value}, ${inputs[1].checked ? 'DMZ configurado com sucesso' : 'Porém não foi possível realizar a configuração'}.\n`);
        }
    }

    class BlocoCancelamento extends Bloco {
        constructor() {
            const motivoSelect = createSelect(Object.keys(Enums.MotivosCancelamento), 'MotivosCancelamento');
            const retencaoInput = createInput('Ação para reter cliente');
            const { checkbox: transferidoCheckbox, label: transferidoLabel, container: transferidoContainer } = createCheckbox('Transferido para retenção');
            const { checkbox: resolvidoCheckbox, label: resolvidoLabel, container: resolvidoContainer } = createCheckbox('Resolvido no suporte');
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

            super([motivoSelect, retencaoInput, resolvidoContainer, transferidoContainer, setorSelect], (inputs) => {
                const motivoTexto = motivoSelect.value === 'OUTRO' ? outroMotivoInput.value : Enums.MotivosCancelamento[motivoSelect.value][1];
                const transferidoTexto = inputs[3].checked ? `Transferido para o setor ${inputs[4].value}` : '';
                const resolvidoTexto = inputs[2].checked ? 'Cliente aceita proposta.\n':'Cliente recusa proposta.\n';
                return `solicita cancelamento de seu plano por ${motivoTexto}.\n ${inputs[1].value}, ${resolvidoTexto}${transferidoTexto}`;
            });
        }
    }

    class BlocoInformacoes extends Bloco {
        constructor() {
            const solicitacaoInput = createInput('Solicitação');
            const respostaInput = createInput('Resposta');
            super([solicitacaoInput, respostaInput], (inputs) => `Informações: Solicitação ${inputs[0].value}, Resposta ${inputs[1].value}`);
        }
    }

    class BlocoRemocaoCGNAT extends Bloco {
        constructor() {
            const motivoInput = createInput('Motivo');
            super([motivoInput], (inputs) => `Remoção CGNAT: Motivo ${inputs[0].value}`);
        }
    }

    const updateResultado = () => {
        const nome = nomeInput.value;
        const resultado = blocos.map(bloco => bloco.getOutput()).join('\n\n');
        resultadoDiv.textContent = `${nome} ${resultado}`;
        updateTitle();
    };

    const updateTitle = () => {
        const nome = nomeInput.value;
        const solicitacao = blocos.length > 0 ? blocos[blocos.length - 1].getOutput().split(':')[0] : '';
        document.title = nome ? `${nome} - ${solicitacao}` : 'Formatador de Strings';
    };

    const createInput = (placeholder) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.addEventListener('input', updateResultado);
        return input;
    };

    const createCheckbox = (labelText) => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', updateResultado);

        const label = document.createElement('label');
        label.textContent = labelText;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        return { checkbox, label, container: checkboxContainer };
    };

    const createSelect = (options, enumType) => {
        const select = document.createElement('select');
        select.dataset.enum = enumType;
        select.innerHTML = `<option value="">Escolha</option>` + options.map(option => `<option value="${option}">${Enums[enumType][option][0]}</option>`).join('');
        select.addEventListener('change', updateResultado);
        return select;
    };

    const addBloco = (solicitacao) => {
        let bloco;
        if (solicitacao === 'REDIRECIONAMENTO_DE_PORTA') {
            bloco = new BlocoRedirecionamentoDePorta();
        } else if (solicitacao === 'DMZ') {
            bloco = new BlocoDMZ();
        } else if (solicitacao === 'CANCELAMENTO') {
            bloco = new BlocoCancelamento();
        } else if (solicitacao === 'INFORMACOES') {
            bloco = new BlocoInformacoes();
        } else if (solicitacao === 'REMOCAO_CGNAT') {
            bloco = new BlocoRemocaoCGNAT();
        }

        if (bloco) {
            detalhesAcaoDiv.appendChild(bloco.element);
            blocos.push(bloco);
            updateResultado();
            addSolicitacaoSelect(bloco.element.parentNode);
        }
    };

    const addSolicitacaoSelect = (afterElement) => {
        const solicitacaoSelect = createSelect(Object.keys(Enums.Solicitacoes), 'Solicitacoes');
        solicitacaoSelect.className = 'solicitacao-select';
        solicitacaoSelect.addEventListener('change', () => {
            const solicitacao = solicitacaoSelect.value;
            if (solicitacao) {
                addBloco(solicitacao);
                solicitacaoSelect.remove();
            }
        });
        if (afterElement) {
            afterElement.appendChild(solicitacaoSelect);
        } else {
            detalhesAcaoDiv.appendChild(solicitacaoSelect);
        }
    };

    nomeInput.addEventListener('input', updateResultado);
    nomeInput.addEventListener('input', updateTitle);

    // Alternar tema
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    });

    // Definir tema padrão com base no sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.add('light-theme');
    }

    // Adicionar o primeiro seletor de solicitação
    addSolicitacaoSelect();
});
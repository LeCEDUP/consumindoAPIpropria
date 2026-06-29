const buscarAlunos = async () => {
    try {
        let resposta = await fetch('http://localhost:3000/users');
        resposta = await resposta.json();

        if (typeof(resposta) !== 'object') {
            return [];
        } else {
            return resposta;
        }
    } catch (e) {
        console.error(e);
    }
};

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const enviarAluno = async () => {
    const nome = document.querySelector("#input-nome").value.trim();
    const nascimento = document.querySelector('#input-nascimento').value.trim();
    const email = document.querySelector("#input-email").value.trim();
    const telefone = document.querySelector("#input-telefone").value.trim();
    const feedback = document.querySelector('#feedback');

    if (!nome || !nascimento) {
        feedback.textContent = "⚠️ ALERTA: Nome e Data de Nascimento são obrigatórios para o registro!";
        style.color = "var(--detalhe-alerta)";
    } else if (!validarEmail(email)) {
        feedback.textContent = "⚠️ ALERTA: Email inválido! Exemplo correto.: seuemail@email.com";
        style.color = "var(--detalhe-alerta)";
    } else if (telefone.length !== 15 || telefone.length !== 14) {
        feedback.textContent = "⚠️ ALERTA: Telefone inválido! Quantidade de números menor que o necessário!";
        style.color = "var(--detalhe-alerta)";
    } else {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: { nome, nascimento, telefone, email } })
            }
            let resposta = await fetch('http://localhost:3000/users', options);
            resposta = await resposta.json();
            feedback.textContent = resposta;
    
            document.querySelector("#input-nome").value = '';
            document.querySelector("#input-nascimento").value = '';
            document.querySelector("#input-email").value = '';
            document.querySelector("#input-telefone").value = '';
            
    
            limparAlunos();
            await renderAlunos();
        } catch (e) {
            console.error(e);
        }
    }
}

const removerAluno = async (evento) => {
    const id = evento.target.dataset.id;
    const feedback = document.querySelector('#feedback');

    try {
        let resposta = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE'
        });
        evento.target.parentElement.remove();
        resposta = await resposta.json();
        feedback.textContent = resposta;
    } catch (e) {
        console.error(e);
    }
};

const calcularIdade = (dataNascimento) => {
    const data = new Date(dataNascimento);
    const hoje = new Date(Date.now());

    let idade = hoje.getFullYear() - data.getFullYear();

    if (hoje.getMonth() < data.getMonth() || (hoje.getMonth() === data.getMonth() && hoje.getDate() < data.getDate())) {
        idade -= 1;
    }

    return idade;
}

const renderAlunos = async () => {
    const alunos = await buscarAlunos();

    const elemUl = document.querySelector('#lista-alunos');

    for (let aluno of alunos) {
        const elemLi = document.createElement('li');

        // const idade = aluno.nascimento
        elemLi.innerHTML = `Nome: ${aluno.nome} - Data de Nascimento: ${aluno.nascimento} - Idade: ${calcularIdade(aluno.nascimento)} -Tel: ${aluno.telefone} - Email: ${aluno.email}`;
        const btRemover = document.createElement('input');
        btRemover.type = 'button';
        btRemover.classList.add('botoes-remover');
        btRemover.dataset.id = aluno._id;
        btRemover.value = '❌';
        btRemover.onclick = removerAluno;

        const btEditar = document.createElement('input');
        btEditar.type = 'button';
        btEditar.classList.add('botoes-editar');
        btEditar.dataset.id = aluno._id;
        btEditar.value = '✏️';
        btEditar.onclick = editarAluno;

        elemLi.appendChild(btRemover);
        elemLi.appendChild(btEditar);
        elemUl.appendChild(elemLi);
    }
};

const editarAluno = async (evento) => {
    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.placeholder = 'Nome';
    inputNome.id = 'input-editar-nome';

    const inputNascimento = document.createElement('input');
    inputNascimento.type = 'date';
    inputNascimento.id = 'input-editar-nascimento';

    const inputTelefone = document.createElement('input');
    inputTelefone.type = 'tel';
    inputTelefone.placeholder = 'Telefone';
    inputTelefone.id = 'input-editar-telefone';

    const inputEmail = document.createElement('input');
    inputEmail.type = 'text';
    inputEmail.placeholder = 'Email';
    inputEmail.id = 'input-editar-email';

    const btAtualizar = document.createElement('button');
    btAtualizar.innerText = '✔️';
    btAtualizar.dataset.id = evento.target.dataset.id;
    btAtualizar.onclick = atualizarAluno;

    evento.target.parentNode.appendChild(inputNome);
    evento.target.parentNode.appendChild(inputNascimento);
    evento.target.parentNode.appendChild(inputTelefone);
    evento.target.parentNode.appendChild(inputEmail);
    evento.target.parentNode.appendChild(btAtualizar);
}

const atualizarAluno = async (evento) => {
    const nome = document.querySelector('#input-editar-nome').value.trim();
    const nascimento = document.querySelector('#input-editar-nascimento').value.trim();
    const telefone = document.querySelector('#input-editar-telefone').value.trim();
    const email = document.querySelector('#input-editar-email').value.trim();
    const feedback = document.querySelector('#feedback');

    if (!nome || !nascimento) {
        feedback.textContent = "⚠️ ALERTA: Nome e Data de Nascimento são obrigatórios para o registro!";
        style.color = "var(--detalhe-alerta)";
    } else {
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: { nome, nascimento, telefone, email} })
            }
            let resposta = await fetch(`http://localhost:3000/users/${evento.target.dataset.id}`, options);
            resposta = await resposta.json();
            feedback.textContent = resposta;
            limparAlunos();
            await renderAlunos();
        } catch (e) {
            console.error(e);
        }
    }

}

const limparAlunos = () => {
    const elemUl = document.querySelector('#lista-alunos');

    while (elemUl.firstChild) {
        elemUl.removeChild(elemUl.firstChild);
    }
}

const trocarCores = (evento) => {
    const estado = evento.target.value;

    if (estado === 'claro') {
        document.head.querySelector('#css').setAttribute('href', 'light.css');
    } else if (estado === 'escuro') {
        document.head.querySelector('#css').setAttribute('href', 'dark.css');
    } else if (estado === 'cyberpunk') {
        document.head.querySelector('#css').setAttribute('href', 'joao.css');
    } else if (estado === 'thewalkingdead') {
        document.head.querySelector('#css').setAttribute('href', 'Marlon.css');
    } else if (estado === 'blackstar') {
        document.head.querySelector('#css').setAttribute('href', 'predo.css');
    } else if (estado === '8bit') {
        document.head.querySelector('#css').setAttribute('href', '8bit.css');
    }
}

// Função feita com o auxílio do Gemini
const mascaraTelefone = (event) => {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    // Limita o tamanho máximo para evitar estouro (11 dígitos para celular com DDD)
    if (value.length > 11) value = value.slice(0, 11);

    // Aplica a máscara dependendo da quantidade de dígitos
    if (value.length > 10) {
        // Formato Celular: (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
        // Formato Telefone Fixo: (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
        // Formato parcial: (XX) XXXX
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length > 0) {
        // Formato inicial: (XX
        value = value.replace(/^(\d*)$/, '($1');
    }

    input.value = value;
}


const selectMode = document.querySelector('#select-tema');
const botaoEnviar = document.querySelector('#botao-enviar');
const inputTel = document.querySelector('#input-telefone');
renderAlunos()

selectMode.addEventListener('click', trocarCores);
inputTel.addEventListener('input', mascaraTelefone);
botaoEnviar.addEventListener('click', enviarAluno);
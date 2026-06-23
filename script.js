const buscarAlunos = async () => {
    try {
        let resposta = await fetch('http://localhost:3000/users');
        resposta = await resposta.json();
        return resposta;
    } catch (e) {
        console.error(e);
    }
};

const enviarAluno = async () => {
    const nome = document.querySelector("#input-nome").value;
    const idade = document.querySelector("#input-idade").value;
    const feedback = document.querySelector('#feedback');

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user: { nome, idade }})
        }
        let resposta = await fetch('http://localhost:3000/users', options);
        resposta = await resposta.json();
        feedback.textContent = resposta;
        limparAlunos();
        await renderAlunos();
    } catch (e) {
        console.error(e);
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

const renderAlunos = async () => {
const alunos = await buscarAlunos();

const elemUl = document.querySelector('#lista-alunos');

    for (let aluno of alunos) {
        const elemLi = document.createElement('li');

        elemLi.innerHTML = `Nome: ${aluno.nome} - Idade: ${aluno.idade}`;
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

    const inputIdade = document.createElement('input');
    inputIdade.type = 'number';
    inputIdade.placeholder = 'Idade';
    inputIdade.id = 'input-editar-idade';

    const btAtualizar = document.createElement('button');
    btAtualizar.innerText = '✔️';
    btAtualizar.dataset.id = evento.target.dataset.id;
    btAtualizar.onclick = atualizarAluno;

    evento.target.parentNode.appendChild(inputNome);
    evento.target.parentNode.appendChild(inputIdade);
    evento.target.parentNode.appendChild(btAtualizar);
}

const atualizarAluno = async (evento) => {
    const nome = document.querySelector('#input-editar-nome').value;
    const idade = document.querySelector('#input-editar-idade').value;
    const feedback = document.querySelector('#feedback');

    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user: { nome, idade}})
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
    } else if (estado === '8bit') {
        document.head.querySelector('#css').setAttribute('href', '8bit.css');
    }  
}

const selectMode = document.querySelector('#select-tema');
const botaoEnviar = document.querySelector('#botao-enviar');
renderAlunos()

selectMode.addEventListener('click', trocarCores)
botaoEnviar.addEventListener('click', enviarAluno);

let tbody = document.querySelector("table>tbody");
let btnAdicionar = document.getElementById("btn-adicionar");
let form = {
    nome:document.getElementById("nome"),
    quantidade:document.getElementById("quantidade"),
    valor:document.getElementById("valor"),
    btnSalvar: document.getElementById("btn-salvar"),
    btnCancelar:document.getElementById("btn-cancelar")
}

let listaProdutos = [];

btnAdicionar.addEventListener('click', () =>{
  abrirModal();
 
});


form.btnSalvar.addEventListener('click', () =>{
  
  let produto = {
    nome:form.nome.value,
    quantidadeEstoque:form.quantidade.value,
    valor:form.valor.value
  }
  
 
    // verificar se os campos foram preenchido
  if(!produto.nome || !produto.quantidadeEstoque || !produto.valor){
    //senao foi mandar mensagem para o usuario preencher
     alert("Os campos nome, quantidade e valor sao obrigatórios");
     return;
  }

   //caso contrario enviar os dados para salvar no backend.
   cadastrarProdutoNaAPI(produto)

  
});

function cadastrarProdutoNaAPI(produto){

  fetch("http://localhost:3000/produtos", {
    headers:{
       "Content-type":"application/json",
    },
    method:"POST",
    body:JSON.stringify(produto)
  })
    .then((response) => response.json())
    .then((response) => {
       obterProdutosDaApi()
       limparCampos()
    })
    .catch((erro) => {
      console.log("deu ruim")
    })


}


function obterProdutosDaApi() {
  fetch("http://localhost:3000/produtos")
    .then((response) => response.json()) // se funcionar
    .then((response) => {
      //para cada produto que vier adicionar na tabela
      listaProdutos = response.map(p => new Produto(p));
      preencherTabela(listaProdutos);
    })
    .catch((erro) => console.log(erro));
}

function preencherTabela(produtos) {
  //limpando a tabela para receber os produtos
  tbody.textContent ="";
  produtos.map((produto) => {

    //criar os tr e os td
    let tr = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdNome = document.createElement("td");
    let tdQuantidade = document.createElement("td");
    let tdValor = document.createElement("td");
    let tdacoes = document.createElement("td");

    
    // passa os valores para dentro da td
    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdQuantidade.textContent = produto.quantidadeEstoque;
    tdValor.textContent = aplicarMascaraParaRealComPrefixo(produto.valor);

    tdacoes.innerHTML = `
    <button onclick="editarProduto(${produto.id})" class="btn btn-link">Editar</button> /
    <button onclick="excluirProduto(${produto.id})" class="btn btn-link">Excluir</button>`;
    
    //pega o tr e adicionar nos tds
    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdQuantidade);
    tr.appendChild(tdValor);
    tr.appendChild(tdacoes)

    tbody.appendChild(tr);
  });
}

function limparCampos(){
  form.nome.value = "";
  form.quantidade.value = "";
  form.valor.value = "";
}

function editarProduto(id){
  alert(id)
}

function excluirProduto(id){
  alert(id)
}

function abrirModal(){
  $("#modal-produtos").modal({backdrop:"static"});
}

function fecharModal(){
  $("#modal-produtos").modal("hide");

 
}


obterProdutosDaApi();

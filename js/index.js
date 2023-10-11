let tbody = document.querySelector("table>tbody");

let btnAdicionar = document.querySelector("#btn-adicionar");

let form = {
    id:document.getElementById("id"),
    nome:document.getElementById("nome"),
    quantidade:document.getElementById("quantidade"),
    valor:document.getElementById("valor"),
    btnSalvar: document.getElementById("btn-salvar"),
    btnCancelar:document.getElementById("btn-cancelar")
}

let listaProdutos = [];
let modoEdicao = false;

btnAdicionar.addEventListener('click', () =>{
  modoEdicao = false;
  limparCampos();
  abrirModal();
});

form.btnSalvar.addEventListener('click', () =>{
  
  let produto = {
    id:form.id.value,
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
   modoEdicao ? atualizarProdutoNaAPI(produto) :
   cadastrarProdutoNaAPI(produto);

  
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

function atualizarProdutoNaAPI(produto){

  fetch(`http://localhost:3000/produtos/${produto.id}`, {
    headers:{
       "Content-type":"application/json",
    },
    method:"PUT",
    body:JSON.stringify(produto)
  })
    .then((response) => response.json())
    .then((response) => {
       atualizarProdutoNaTela(response, false)
       fecharModal();
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

function atualizarProdutoNaTela(produto, deletarProduto){
  let index = listaProdutos.findIndex(p => p.id == produto.id)

  deletarProduto ?
     listaProdutos.splice(index, 1) : //remove produto
     listaProdutos.splice(index, 1, produto); //atualizando o produto na lista
  preencherTabela(listaProdutos);
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
  form.id.value = "";
  form.nome.value = "";
  form.quantidade.value = "";
  form.valor.value = "";
}

function deletarProdutoNaAPI(produto){
  fetch(`http://localhost:3000/produtos/${produto.id}`, {
    headers:{
       "Content-type":"application/json",
    },
    method:"DELETE",
    
  })
    .then((response) => response.json())
    .then(() => {
       atualizarProdutoNaTela(produto, true)
       
    })
    .catch((erro) => {
      console.log("deu ruim")
    })
}

function atualizarModal(produto){
   form.id.value = produto.id;
   form.nome.value = produto.nome;
   form.quantidade.value = produto.quantidadeEstoque;
   form.valor.value = produto.valor;
}

function editarProduto(id){
  modoEdicao = true;
  let produto = listaProdutos.find(p => p.id == id);
  atualizarModal(produto)
  abrirModal()
  
}

function excluirProduto(id){
  let produto = listaProdutos.find(p => p.id == id);

  if(confirm(`Deseja excluir o produto ${produto.id} - ${produto.nome}`)){
     deletarProdutoNaAPI(produto)
  }
}

function abrirModal(){
   $("#modal-produtos").modal("show");
 
}

function fecharModal(){
   $("#modal-produtos").modal("hide");
}


obterProdutosDaApi();

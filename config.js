// config.js
// Configuração do projeto Firebase usado pelo painel de organogramas.
// As chaves de um app web do Firebase não são segredos (elas identificam o
// projeto, não autenticam ninguém sozinhas) — mas manter esse bloco em um
// arquivo separado facilita trocar de projeto Firebase (ex.: ambiente de
// testes vs. produção) sem precisar mexer no index.html.
//
// Se você duplicar este painel para outra instituição/outro projeto Firebase,
// basta gerar um novo app web no Firebase Console e colar os valores dele aqui.
const firebaseConfig = {
  apiKey: "AIzaSyAsio8iwIRf2d2J-IgLVdqMHIyCWn2Pcts",
  authDomain: "painel-organograma.firebaseapp.com",
  projectId: "painel-organograma",
  storageBucket: "painel-organograma.firebasestorage.app",
  messagingSenderId: "607161748605",
  appId: "1:607161748605:web:7cf94832268a1d10093514"
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzzoaqzo";

        // Preenche o span com id 'current-year' no rodapé com o ano atual dinamicamente.
        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Seleciona todos os links que apontam para âncoras internas (href="#secao")
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {

            // Adiciona um ouvinte de evento de clique
            anchor.addEventListener('click', function (e) {
                // Previne o comportamento padrão do link
                e.preventDefault();
                // Rola a tela até o elemento correspondente ao href e define a rolagem como suave (smooth scroll)
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Adiciona um evento de clique ao botão do menu móvel
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            // Alterna a classe Tailwind '-translate-x-full' na tag 'aside' (barra lateral),
            // mostrando ou ocultando o menu móvel.
            document.querySelector('aside').classList.toggle('-translate-x-full');
        });

        // =======================================================
        // FUNÇÃO: Envio Assíncrono (fetch) e Feedback Local
        // =======================================================
        document.getElementById('contact-form').addEventListener('submit', async function (e) {
            // 1. Impede o envio padrão do formulário (que levaria para a página do Formspree)
            e.preventDefault();

            const form = this;
            const successMessage = document.getElementById('success-message');
            const errorMessage = document.getElementById('error-message');
            const submitButton = form.querySelector('button[type="submit"]');

            // Esconde quaisquer mensagens anteriores
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
            submitButton.disabled = true; // Desabilita o botão para evitar cliques duplicados
            submitButton.textContent = 'Enviando...';

            // 2. Validação nativa do HTML5
            if (!form.checkValidity()) {
                errorMessage.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
                form.reportValidity(); 
                return;
            }

            // 3. Coleta os dados do formulário
            const formData = new FormData(form);

            try {
                // 4. Envia os dados assincronamente para o Formspree
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                // 5. Verifica se o envio foi bem-sucedido
                if (response.ok) {
                    // Exibe a mensagem de sucesso
                    successMessage.classList.remove('hidden');
                    
                    // Limpa o formulário
                    form.reset();

                    // Oculta a mensagem após 5 segundos
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 5000);
                } else {
                    // Trata erros de envio do Formspree (e.g., erro de validação do lado deles)
                    errorMessage.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, verifique os campos.';
                    errorMessage.classList.remove('hidden');
                }
            } catch (error) {
                // Trata erros de rede
                errorMessage.textContent = 'Erro de conexão. Verifique sua rede e tente novamente.';
                errorMessage.classList.remove('hidden');
            } finally {
                // 6. Restaura o estado do botão
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
            }
        });
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzzoaqzo";

document.addEventListener('DOMContentLoaded', () => {

    // 1. Preenche o ano no rodapé
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // 2. Rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Toggle do menu móvel
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const asideElement = document.querySelector('aside');
    if (mobileMenuBtn && asideElement) {
        mobileMenuBtn.addEventListener('click', () => {
            asideElement.classList.toggle('-translate-x-full');
        });
    }

    // 4. Envio Assíncrono (fetch) do Formulário
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
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
    }
});
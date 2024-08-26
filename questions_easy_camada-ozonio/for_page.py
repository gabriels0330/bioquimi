import tkinter as tk
from tkinter import messagebox

def gerar_html(titulo, text1, text2, text3, text4, explica_texto, correct_card, nome_arquivo):
    # Define o valor de data-answer para cada card
    answers = ["incorrect", "incorrect", "incorrect", "incorrect"]
    answers[correct_card] = "correct"
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../our_logos/favicon_logos(1)/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="for_quiz.css">
    <script src="for_quiz.js"></script>

    <title> Combustiveís fósseis | Quiz | Bioquimi </title>
</head>
<body>

    <header>
        <h1> {titulo.upper()} </h1>

        <div class="results">
            <div class="result-item">Acertos: <span id="correctCount">0</span>/15</div>
            <div class="result-item">Respondidas: <span id="totalAnswered">0</span>/15</div>
        </div>

    </header>
    <section>
        <div class="container">
            <div class="cards" data-answer="{answers[0]}">
                <img src="../imagens de alternativas/dioxido de enxofre.png" alt="Dióxido de enxofre">
                <p>{text1}</p>
            </div>

            <div class="cards" data-answer="{answers[1]}">
                <img src="../imagens de alternativas/dioxido de nitrogenio.png" alt="Dióxido de nitrogênio">
                <p>{text2}</p>
            </div>

            <div class="cards" data-answer="{answers[2]}">
                <img src="../imagens de alternativas/monoxido de carbono.png" alt="Monóxido de carbono">
                <p>{text3}</p>
            </div>

            <div class="cards" data-answer="{answers[3]}">
                <img src="../imagens de alternativas/metano.png" alt="Metano">
                <p>{text4}</p>
            </div>
        </div>
    </section>

    <div class="check">
        <div id="bolaContainer"></div>
        <div id="explica"><p>{explica_texto}</p></div>
        <button id="next" type="button" disabled>CONFERIR</button>
    </div>

    <audio id="audioCorrect" src="../imagens de alternativas/level-passed-142971.mp3"></audio>
    <audio id="audioIncorrect" src="../imagens de alternativas/derrota.mp3"></audio>
</body>
</html>"""
    
    with open(nome_arquivo, "w", encoding="utf-8") as file:
        file.write(html_content)

    messagebox.showinfo("Sucesso", "A página HTML foi gerada com sucesso!")

def alterar_resposta(card_index):
    global correct_card
    correct_card = card_index
    card_buttons[0].config(bg="lightgrey")
    card_buttons[1].config(bg="lightgrey")
    card_buttons[2].config(bg="lightgrey")
    card_buttons[3].config(bg="lightgrey")
    card_buttons[card_index].config(bg="lightgreen")

def gerar_pagina():
    titulo = titulo_entry.get()
    text1 = text1_entry.get()
    text2 = text2_entry.get()
    text3 = text3_entry.get()
    text4 = text4_entry.get()
    explica_texto = explica_entry.get()
    nome_arquivo = arquivo_entry.get()
    
    if titulo and text1 and text2 and text3 and text4 and nome_arquivo:
        gerar_html(titulo, text1, text2, text3, text4, explica_texto, correct_card, nome_arquivo)
    else:
        messagebox.showwarning("Atenção", "Por favor, preencha todos os campos.")

# Configuração da janela principal
root = tk.Tk()
root.title("Gerador de Página HTML")

correct_card = 0

# Título
titulo_label = tk.Label(root, text="Título:")
titulo_label.grid(row=0, column=0, padx=10, pady=10)
titulo_entry = tk.Entry(root, width=50)
titulo_entry.grid(row=0, column=1, padx=10, pady=10)

# Primeiro Texto
text1_label = tk.Label(root, text="Texto do primeiro card:")
text1_label.grid(row=1, column=0, padx=10, pady=10)
text1_entry = tk.Entry(root, width=50)
text1_entry.grid(row=1, column=1, padx=10, pady=10)
text1_button = tk.Button(root, text="Card 1 como correto", command=lambda: alterar_resposta(0))
text1_button.grid(row=1, column=2, padx=10, pady=10)

# Segundo Texto
text2_label = tk.Label(root, text="Texto do segundo card:")
text2_label.grid(row=2, column=0, padx=10, pady=10)
text2_entry = tk.Entry(root, width=50)
text2_entry.grid(row=2, column=1, padx=10, pady=10)
text2_button = tk.Button(root, text="Card 2 como correto", command=lambda: alterar_resposta(1))
text2_button.grid(row=2, column=2, padx=10, pady=10)

# Terceiro Texto
text3_label = tk.Label(root, text="Texto do terceiro card:")
text3_label.grid(row=3, column=0, padx=10, pady=10)
text3_entry = tk.Entry(root, width=50)
text3_entry.grid(row=3, column=1, padx=10, pady=10)
text3_button = tk.Button(root, text="Card 3 como correto", command=lambda: alterar_resposta(2))
text3_button.grid(row=3, column=2, padx=10, pady=10)

# Quarto Texto
text4_label = tk.Label(root, text="Texto do quarto card:")
text4_label.grid(row=4, column=0, padx=10, pady=10)
text4_entry = tk.Entry(root, width=50)
text4_entry.grid(row=4, column=1, padx=10, pady=10)
text4_button = tk.Button(root, text="Card 4 como correto", command=lambda: alterar_resposta(3))
text4_button.grid(row=4, column=2, padx=10, pady=10)

# Texto para a div id="explica"
explica_label = tk.Label(root, text="Texto para 'explica':")
explica_label.grid(row=5, column=0, padx=10, pady=10)
explica_entry = tk.Entry(root, width=50)
explica_entry.grid(row=5, column=1, padx=10, pady=10)

# Nome do arquivo
arquivo_label = tk.Label(root, text="Nome do arquivo (exemplo: pagina_quiz.html):")
arquivo_label.grid(row=6, column=0, padx=10, pady=10)
arquivo_entry = tk.Entry(root, width=50)
arquivo_entry.grid(row=6, column=1, padx=10, pady=10)

# Botão para gerar a página
gerar_button = tk.Button(root, text="Gerar Página HTML", command=gerar_pagina)
gerar_button.grid(row=7, column=0, columnspan=3, padx=10, pady=20)

# Botões para selecionar card correto
card_buttons = [
    text1_button,
    text2_button,
    text3_button,
    text4_button
]

# Iniciar o loop principal da interface gráfica
root.mainloop()

document.addEventListener('DOMContentLoaded', () => {
    const width: number = 10
    // 0
    const L = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]
    // 1
    const I = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]
    // 2
    const O = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    // 3
    const T = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width + 1, width, width * 2 + 1]
    ]
    // 4
    const Z = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    enum Blocos {
        L = 0,
        I = 1,
        O = 2,
        T = 3,
        Z = 4,
    }

    const tudo = [L, I, O, T, Z]

    let toString = function (index: Number): string {
        switch (index) {
            case 0:
                return "L"
            case 1:
                return "I"
            case 2:
                return "O"
            case 3:
                return "T"
            case 4:
                return "Z"
            default:
                return ""
        }
    }

    const dead: string = 'dead'
    const grid = document.querySelector('#main') as HTMLElement
    const btnPausar = document.querySelector("#pausar") as HTMLElement
    const lblPontos = document.querySelector("#pontuacao") as HTMLElement
    const icone = document.querySelector("#icon-pausar") as HTMLImageElement

    let quadrados: Array<HTMLElement>
    let posicaoX: number
    let rotacao: number
    let aleatorio: number
    let bloco: Array<any>
    let move: any
    let pontuacao: number
    let pausado: boolean = true

    function renderGrid() {
        grid.innerHTML = ""
        let linha = 1
        for (let i = 0; i < 200; i++) {
            if ((i % 10) == 0 && i >= 10) linha++

            grid.innerHTML += `<div data-linha='${linha}' data-cell='${i}'></div>`
        }
        //Deadzone
        for (let i = 1; i <= 10; i++) {
            grid.innerHTML += `<div class="${dead} deadzone" data-linha='21'></div>`
        }

        quadrados = Array.from(document.querySelectorAll('#main div'))
    }

    function renderizaBloco() {
        bloco.forEach((index: number) => {
            quadrados[posicaoX + index].classList.add('cubinhos')
            quadrados[posicaoX + index].classList.add(toString(aleatorio))
        })
    }

    function limpaBloco() {
        bloco.forEach((index: number) => {
            quadrados[posicaoX + index].removeAttribute('class');
        })
    }

    function controle(key: any) {
        if (pausado) return

        switch (key.keyCode) {
            case 37:
                left()
                break;
            case 38:
                if (aleatorio != Blocos.O) rotaciona()
                break;
            case 39:
                rigth()
                break;
            case 40:
                down()
                break;
        }
    }

    function morre() {
        if (bloco.some((index: number) => quadrados[posicaoX + index + width].classList.contains(dead))) {
            bloco.forEach((index: number) => quadrados[posicaoX + index].classList.add(dead))

            aleatorio = Math.floor(Math.random() * tudo.length)
            bloco = tudo[aleatorio][rotacao]
            posicaoX = 4
            renderizaBloco()
            pontuar()
            gameOver()
        }
    }

    function down() {
        limpaBloco()
        posicaoX += width
        renderizaBloco()
        morre()
    }

    function left() {
        limpaBloco()
        const bordaesquerda = bloco.some((index: number) => (posicaoX + index) % width === 0)
        if (!bordaesquerda) posicaoX -= 1

        if (bloco.some((index: number) => quadrados[posicaoX + index].classList.contains(dead))) posicaoX += 1

        renderizaBloco()
    }

    function rigth() {
        limpaBloco()
        const bordadireita = bloco.some((index: number) => (posicaoX + index) % width === width - 1)

        if (!bordadireita) posicaoX += 1

        if (bloco.some((index: number) => quadrados[posicaoX + index].classList.contains(dead))) posicaoX -= 1

        renderizaBloco()
    }

    function rotaciona() {
        limpaBloco()
        rotacao++

        if (rotacao === bloco.length) rotacao = 0

        var posicoes: Array<string> = posicaoX.toString().split('')
        const ultimoX: number = parseInt(posicoes[posicoes.length - 1])

        if (ultimoX == 9 && (aleatorio == Blocos.T || aleatorio == Blocos.I || aleatorio == Blocos.L)) {
            posicaoX = posicaoX + 1
        }
        else if (ultimoX == 8 && aleatorio == Blocos.I) {
            posicaoX = posicaoX - 2
        }
        else if (ultimoX >= 8 || (ultimoX == 7 && aleatorio == Blocos.I)) {
            posicaoX = posicaoX - 1
        }

        bloco = tudo[aleatorio][rotacao]
        renderizaBloco()
    }

    function iniciar() {
        clearInterval(move)
        renderGrid()
        posicaoX = 4
        rotacao = 0
        aleatorio = Math.floor(Math.random() * tudo.length)
        bloco = tudo[aleatorio][rotacao]
        move = setInterval(down, 500)
        pontuacao = 0
        pausado = false
        atualizarPontos()
    }

    function togglePausar() {
        if (pausado) {
            pausado = false
            move = setInterval(down, 500)
            icone.src = "../imgs/pause.png"
        }
        else {
            pausado = true
            clearInterval(move)
            icone.src = "../imgs/retomar.png"
        }
    }

    function gameOver() {
        if (bloco.some((index: number) => quadrados[posicaoX + index].classList.contains(dead))) {
            iniciar()
        }
    }

    function pontuar() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => quadrados[index].classList.contains(dead))) {
                pontuacao += 10

                row.forEach(index => {
                    quadrados[index].removeAttribute('class')
                    quadrados[index].style.backgroundColor = ''
                })

                const quadradosRemovidos = quadrados.splice(i, width)
                quadrados = quadradosRemovidos.concat(quadrados)
                quadrados.forEach(cell => grid.appendChild(cell))
            }
        }
        atualizarPontos()
    }

    function atualizarPontos() {
        lblPontos.innerHTML = pontuacao.toString()
    }

    document.addEventListener('keydown', controle)
    btnPausar.addEventListener('click', togglePausar)
    renderGrid()
    iniciar()
})
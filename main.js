document.addEventListener('DOMContentLoaded', () => {
    const numberContainer = document.getElementById('lotto-numbers');
    const generateBtn = document.getElementById('generate-btn');

    // 로또 번호를 생성하고 화면에 표시하는 함수
    const generateLottoNumbers = () => {
        // 기존 번호 삭제
        numberContainer.innerHTML = '';

        const numbers = new Set();
        // 중복되지 않는 6개 숫자 생성
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        // 생성된 번호를 정렬하여 배열로 변환
        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        // 각 번호를 순차적으로 화면에 표시
        sortedNumbers.forEach((number, index) => {
            setTimeout(() => {
                const ball = document.createElement('div');
                ball.className = 'lotto-ball';
                ball.textContent = number;
                ball.classList.add(getColorClass(number));

                numberContainer.appendChild(ball);

                // 애니메이션 효과를 위해 opacity와 transform을 변경
                setTimeout(() => {
                    ball.style.opacity = '1';
                    ball.style.transform = 'translateY(0)';
                }, 50);

            }, index * 200); // 0.2초 간격으로 공 표시
        });
    };

    // 번호에 따라 색상 클래스를 반환하는 함수
    const getColorClass = (number) => {
        if (number <= 10) return 'color-1';
        if (number <= 20) return 'color-2';
        if (number <= 30) return 'color-3';
        if (number <= 40) return 'color-4';
        return 'color-5';
    };

    // 버튼 클릭 이벤트 리스너
    generateBtn.addEventListener('click', generateLottoNumbers);

    // 페이지가 처음 로드될 때 번호를 한 번 생성
    generateLottoNumbers();
});

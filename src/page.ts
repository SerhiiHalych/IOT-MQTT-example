export default `<html>
  <head>
    <title>Sign in</title>
    <meta charset="utf-8" />

    <style>
      body {
        background: #293141;
      }

      .form-wrapper {
        width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 150px auto 0;
        padding: 25px;
      }

      .form-wrapper__input {
        margin: 15px 0;
        padding: 10px;
        font-size: 24px;
        border-radius: 10px;
        outline: none !important;
        border: 1px solid white;
        background-color: transparent;
        color: white;
      }

      .form-wrapper__info {
        font-size: 24px;
        background-color: transparent;
        color: white;
      }

      .form-wrapper__input:focus {
        border: 1px solid #ff6d12;
        background-color: white;
        color: black;
      }

      .form-wrapper__submit {
        color: #ff6d12;
        margin: 15px 0;
        width: 200px;
        background-color: transparent;
        border: 1px solid #ff6d12;
        border-radius: 10px;
        padding: 10px;
        font-size: 20px;
        outline: none !important;
      }

      .form-wrapper__submit:hover {
        background: #ff6d12;
        color: white;
        cursor: pointer;
        box-shadow: 7px 6px 28px 1px rgba(0, 0, 0, 0.24);
      }

      .form-wrapper__submit:active {
        transform: scale(0.98);
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
      }
    </style>

    <script>
      setInterval(function () {
        var potentiometerXhr = new XMLHttpRequest()
        potentiometerXhr.open('GET', '/potentiometer', false)
        potentiometerXhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

        potentiometerXhr.send()

        document.getElementById('potentiomener-value').innerText = JSON.parse(potentiometerXhr.response).potentiometerValue
      }, 1000)

      function setDisplayMessage() {
        const messageToDisplay = document.getElementById('display-value').value

        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/display', false)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({ message: messageToDisplay }))
      }
    </script>
  </head>
  <body>
    <div class="form-wrapper">
      <p class="form-wrapper__info">
        Potentiometer value = <span id="potentiomener-value"></span>
      </p>

      <input type="text" id="display-value" class="form-wrapper__input" />

      <input
        type="button"
        class="form-wrapper__submit"
        value="Display"
        onclick="setDisplayMessage()"
      />
    </div>
  </body>
  <html></html>
</html>
`;

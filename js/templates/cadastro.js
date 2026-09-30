/* Template dinâmico do formulário de cadastro */
window.App = window.App || {};
window.App.templates = window.App.templates || {};

App.templates.cadastro = () => `
  <section id="cadastro" class="container">
    <h1>Cadastre-se para apoiar o Instituto Vida Nova</h1>

    <div id="alerta-formulario" class="alert alert-error" role="alert" hidden>
      Preencha corretamente todos os campos obrigatórios antes de enviar.
    </div>

    <form id="form-cadastro" novalidate>
      <fieldset class="form-fieldset" id="user-details">
        <legend>Dados pessoais</legend>

        <div class="form-field">
          <label for="nome">Nome completo</label>
          <input type="text" id="nome" name="nome" autocomplete="name" required>
        </div>

        <div class="form-field">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" autocomplete="email" required>
        </div>

        <div class="form-field">
          <label for="nascimento">Data de nascimento</label>
          <input type="date" id="nascimento" name="nascimento" autocomplete="bday" required>
        </div>

        <div class="form-field">
          <label for="cpf">CPF</label>
          <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" maxlength="14" required>
        </div>
      </fieldset>

      <fieldset class="form-fieldset" id="contact-info">
        <legend>Endereço e contato</legend>

        <div class="form-field">
          <label for="telefone">Telefone</label>
          <input type="tel" id="telefone" name="telefone" autocomplete="tel" placeholder="(00) 00000-0000" pattern="\\(\\d{2}\\) \\d{5}-\\d{4}" maxlength="15" required>
        </div>

        <div class="form-field">
          <label for="cep">CEP</label>
          <input type="text" id="cep" name="cep" autocomplete="postal-code" placeholder="00000-000" pattern="\\d{5}-\\d{3}" maxlength="9" required>
        </div>

        <div class="form-field">
          <label for="cidade">Cidade</label>
          <input type="text" id="cidade" name="cidade" autocomplete="address-level2" required>
        </div>

        <div class="form-field">
          <label for="estado">Estado</label>
          <select id="estado" name="estado" autocomplete="address-level1" required>
            <option value="">Selecione</option>
            <option value="DF">Distrito Federal</option>
            <option value="GO">Goiás</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
          </select>
        </div>
      </fieldset>

      <fieldset class="form-fieldset preferences" id="preferences">
        <legend>Como você quer ajudar</legend>

        <div class="form-check-group">
          <label><input type="checkbox" name="interesse" value="doacao"> Doação financeira</label>
          <label><input type="checkbox" name="interesse" value="itens"> Doação de itens</label>
          <label><input type="checkbox" name="interesse" value="voluntariado"> Voluntariado</label>
        </div>
      </fieldset>

      <button type="submit" class="btn btn-primary">Cadastrar</button>
    </form>
  </section>
`;

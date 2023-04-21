const puppeteer = require('puppeteer');

(async () => {
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome'
  });
  const page = await browser.newPage();
  await page.goto('https://aluno.uninassau.edu.br/IdP/Login.aspx?OriginalURL=https%3a%2f%2faluno.uninassau.edu.br%2fIdPRouter%2fSelectCourse.aspx&ACEIndex=0')
  await page.waitForSelector("#userNameInput")
  await page.type("#userNameInput", 'seuEmail')
  await page.waitForSelector("#passwordInput")
  await page.type("#passwordInput", 'suaSenha')
  await page.waitForSelector("#submitButton")
  await page.click("#submitButton")
  await page.waitForNavigation()

  const materias = [];
  //seleciona elementos da pagina
  const elementosInfo = await page.$$('.link-geral')
  const notasInfo = await page.$$('.boxValorNota')
  //pega elementos e entrega no console a materia e a nota
  for (i = 0; i < elementosInfo.length; i++) {
    const elementoInfo = elementosInfo[i];
    const nota = notasInfo[i];

    const textoMateria = await elementoInfo.evaluate(el => el.textContent);
    const textoNota = await nota.evaluate(el => el.textContent)

    // console.log(`Materia: ${textoMateria} nota: ${textoNota}`);
    materias.push({ materia: textoMateria, nota: textoNota })
  }
  const fs = require('fs')

  fs.writeFile('./materiais/materias.json', JSON.stringify(materias, null, 2), err => {
    if(err) throw new Error('algo deu errado')

    console.log('Deu tudo certo!')
  })

  await browser.close();
})();

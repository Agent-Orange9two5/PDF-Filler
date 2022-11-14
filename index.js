const { PDFDocument } = require('pdf-lib');
const { readFile, writeFile } = require('fs/promises');
const pacient = require('./pacient.json');
const fontkit = require('@pdf-lib/fontkit')
fs = require('fs');
const path = require('path');

async function createPdf(input, output) {

    try {

        const pdfDoc = await PDFDocument.load(await readFile(input));
        pdfDoc.registerFontkit(fontkit);
        const fontBytes = fs.readFileSync(path.join(__dirname, 'Idautomationhc39m-Mr9x.otf'));
        const customFont = await pdfDoc.embedFont(fontBytes);
        const fieldNames = pdfDoc
            .getForm()
            .getFields()
            .map((f) => f.getName());

        console.log({ fieldNames });

        const form = pdfDoc.getForm();

        // Text fields identification 

        // const possibleFields = Array.from({length:111},(_, i)=>i);
        // possibleFields.forEach((possibleField)=>{
        //     try{
        //         form
        //         .getTextField(`Text${possibleField}`)
        //         .setText(possibleField.toString()); 

        //     }catch(error){
        //         // console.log(error);
        //     }
        // });


        // const json = '{"result":true, "name":"Johny" }';
        // const obj = JSON.parse(json);

        form.getTextField('Name').setText(pacient.name);
        form.getTextField('Age').setText(pacient.age);
        form.getTextField('Barcode').setText(pacient.barcode);
        form.getTextField('Barcode').updateAppearances(customFont);

        const pdfBytes = await pdfDoc.save();

        await writeFile(output, pdfBytes);
        console.log('PDF created');
    } catch (err) {
        console.log(err);
    }

}

createPdf('template.pdf', 'output.pdf');


const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../images');
const base64Icons = {};

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Unable to scan directory:', err);
        return;
    }

    files.forEach((file, index, array) => {
        if (path.extname(file) === '.png') {
            const filePath = path.join(directoryPath, file);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }
                const base64Image = Buffer.from(data).toString('base64');
                const iconName = path.basename(file, '.png'); // Use the file name as a key
                base64Icons[iconName] = `data:image/png;base64,${base64Image}`;

                // When last file is processed, write to JSON
                if (index === array.length - 1) {
                    fs.writeFileSync(path.join(__dirname, 'icons.json'), JSON.stringify(base64Icons, null, 2));
                }
            });
        }
    });
});

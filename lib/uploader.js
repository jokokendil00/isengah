async function catbox(filePath) { 
   
  try { 
    const fileStream = fs.createReadStream(filePath); 
    const formData = new FormData(); 
    formData.append('reqtype', 'fileupload'); 
    formData.append('userhash', ''); 
    formData.append('fileToUpload', fileStream, path.basename(filePath)); 
    const response = await fetch('https://catbox.moe/user/api.php', { 
      method: 'POST', 
      headers: { 
        ...formData.getHeaders(), 
        Referer: 'https://catbox.moe/', 
      }, 
      body: formData, 
    }); 
    const result = await response.text(); 
    return { success: true, result: result } 
  } catch (error) { console.error(error); return error } 
  }

module.exports = { catbox }
export default function showSignature(signature, uploadSignature) {
  if (signature) {
    let signArr = signature?.split(';');
    return <div>
      {info(signArr, uploadSignature)}
    </div>
  } else {
    return '';
  }
}

const info = (signArr, uploadSignature) => {
  return signArr.map((v, k) => {
    return (
      <div
        className='filesignaturediv'
        style={{ cursor: 'pointer', textDecoration: 'underline', fontStyle: 'italic' }}
        onClick={() => {
          if (v) {
            uploadSignature(v);
          }
        }}>{v ? v : ''}
      </div>
    )
  })
}

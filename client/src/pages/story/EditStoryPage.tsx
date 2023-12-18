import { Editor } from '@tinymce/tinymce-react'

const EditStoryPage = () => {
  return (
    <div className='flex flex-col justify-items-center'>

      <Editor
        apiKey='cl0f7stppfmnuulii3hvi4dhnko97k32vvg06zrd6n8ealln'
        init={{
          plugins: 'tinycomments mentions anchor autolink charmap codesample image link lists media searchreplace visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | align lineheight | tinycomments | checklist numlist bullist indent outdent | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
        }}
        initialValue="Start writing your life story here!"
      />

      <div className='flex flex-row justify-between items-center my-6'>
        <div className='flex flex-row justify-center items-center'>
          <button className='bg-secondary p-2 rounded-xl shadow-md mr-2 w-32'>Previous Page</button>
          <button className='bg-secondary p-2 rounded-xl shadow-md w-32'>Next Page</button>
        </div>
        <button className='bg-gradient rounded-xl shadow-md font-bold p-2 w-32'>Save Page</button>
      </div>

    </div>
  )
}

export default EditStoryPage

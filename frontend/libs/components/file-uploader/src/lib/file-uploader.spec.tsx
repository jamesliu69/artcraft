import { act, render, screen } from '@testing-library/react';
import { setLocale } from '@storyteller/common';
import { DragAndDropZone } from './drag-and-drop-zone';
import { FileUploader } from './file-uploader';

describe('FileUploader', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(
      <FileUploader files={[]} fileTypes={['png']} handleChange={vi.fn()} />,
    );
    expect(baseElement).toBeTruthy();
  });

  it('updates upload instructions immediately when the locale changes', () => {
    render(<DragAndDropZone files={[]} fileTypes={['PNG']} />);

    expect(screen.getByText('Upload a file')).toBeTruthy();
    try {
      act(() => setLocale('zh-TW'));
      expect(screen.getByText('上傳檔案')).toBeTruthy();
    } finally {
      act(() => setLocale('en'));
    }
    expect(screen.getByText('Upload a file')).toBeTruthy();
  });
  
});

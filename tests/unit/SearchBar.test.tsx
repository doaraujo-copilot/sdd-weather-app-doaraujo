import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SearchBar from '../../src/components/SearchBar';

describe('SearchBar', () => {
  it('não dispara onSearch para input vazio', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('dispara onSearch com o valor digitado', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText('Buscar cidade');
    await user.type(input, 'Curitiba');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('Curitiba');
  });

  it('não dispara onSearch para input apenas com espaços', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText('Buscar cidade');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('exibe mensagem de validação ao tentar enviar busca vazia', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    fireEvent.submit(screen.getByRole('search'));

    expect(screen.getByRole('alert')).toHaveTextContent('Digite o nome de uma cidade para buscar.');
  });

  it('remove a mensagem de validação ao digitar novamente', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    const input = screen.getByLabelText('Buscar cidade');
    fireEvent.change(input, { target: { value: 'Curitiba' } });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

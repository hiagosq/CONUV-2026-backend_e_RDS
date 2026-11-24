package br.com.salgadaria.services;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.salgadaria.models.Salgado;
import br.com.salgadaria.repositories.SalgadoRepository;

@Service
public class SalgadoService {

    private final SalgadoRepository repository;

    public SalgadoService(SalgadoRepository repository) {
        this.repository = repository;
    }

    public List<Salgado> listar() {
        return repository.findAll();
    }

    public Salgado buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public Salgado salvar(Salgado salgado) {
        salgado.setId(null);
        return repository.save(salgado);
    }

    @Transactional
    public Salgado atualizar(Integer id, Salgado dados) {
        Salgado existente = repository.findById(id).orElse(null);
        if (existente == null) {
            return null;
        }
        existente.setNome(dados.getNome());
        existente.setCategoria(dados.getCategoria());
        existente.setCustoUnitario(dados.getCustoUnitario());
        existente.setPrecoVenda(dados.getPrecoVenda());
        existente.setQuantidadeEstoque(dados.getQuantidadeEstoque());
        return repository.save(existente);
    }

    @Transactional
    public boolean excluir(Integer id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
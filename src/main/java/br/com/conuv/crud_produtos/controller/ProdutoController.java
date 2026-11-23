package br.com.salgadaria.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.com.salgadaria.models.Salgado;
import br.com.salgadaria.services.SalgadoService;

@RestController
@RequestMapping("/salgados")
@CrossOrigin(origins = "*")
public class SalgadoController {

    private final SalgadoService service;

    public SalgadoController(SalgadoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Salgado>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salgado> buscar(@PathVariable Integer id) {
        Salgado salgado = service.buscarPorId(id);
        if (salgado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(salgado);
    }

    @PostMapping
    public ResponseEntity<Salgado> cadastrar(@RequestBody Salgado salgado) {
        Salgado salvo = service.salvar(salgado);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Salgado> atualizar(@PathVariable Integer id, @RequestBody Salgado salgado) {
        Salgado atualizado = service.atualizar(id, salgado);
        if (atualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        boolean removido = service.excluir(id);
        if (!removido) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
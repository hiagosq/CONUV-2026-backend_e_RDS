package br.com.salgadaria.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.salgadaria.models.Salgado;

public interface SalgadoRepository extends JpaRepository<Salgado, Integer> {
}
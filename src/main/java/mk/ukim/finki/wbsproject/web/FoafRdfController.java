package mk.ukim.finki.wbsproject.web;

import mk.ukim.finki.wbsproject.service.FoafProfileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "/foaf/profile")
public class FoafRdfController {
    @Value("${app.wbs-project.backend-endpoint}")
    private String BACKEND_ENDPOINT;
    private final FoafProfileService foafProfileService;

    public FoafRdfController(FoafProfileService foafProfileService) {
        this.foafProfileService = foafProfileService;
    }

    @GetMapping(path = "/rdf/{id}", produces = {"text/turtle;charset=UTF-8"})
    public @ResponseBody String getTurtle(HttpServletRequest request) {
        String personalProfileDocumentUri = BACKEND_ENDPOINT + request.getRequestURI();
        return this.foafProfileService.getPersonalProfileDocument(personalProfileDocumentUri);
    }

}

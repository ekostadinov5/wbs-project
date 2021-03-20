package mk.ukim.finki.wbsproject.web;

import mk.ukim.finki.wbsproject.service.FoafProfileService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "/foaf/profile")
public class FoafRdfController {
    private final FoafProfileService foafProfileService;

    public FoafRdfController(FoafProfileService foafProfileService) {
        this.foafProfileService = foafProfileService;
    }

    @GetMapping(path = "/rdf/{id}", produces = {"text/turtle;charset=UTF-8"})
    public @ResponseBody String getTurtle(HttpServletRequest request) {
        String personalProfileDocumentUri = "http://localhost:8080" + request.getRequestURI();
        return this.foafProfileService.getPersonalProfileDocumentModel(personalProfileDocumentUri);
    }

}
